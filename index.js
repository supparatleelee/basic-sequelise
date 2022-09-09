const { Sequelize, DataTypes, Op, QueryTypes } = require('sequelize');

// https://sequelize.org/docs/v6/getting-started/
// NO NEED TO WRITE PURE SQL LANGUAGE.

// const sequelize = new Sequelize('lab_todo_list', 'root', 'Supparat28', {
//   host: 'localhost',
//   dialect: 'mysql',
// }); // connect to database & return value into the variable

//////////
const sequelize = new Sequelize('seq_todo_list', 'root', 'Supparat28', {
  host: 'localhost',
  dialect: 'mysql',
}); // connect to database & return value into the variable

// sequelize
//   .authenticate()
//   .then(() => console.log('DB connected'))
//   .catch((err) => console.log('Error')); // Just to Test connection, no need to write actually // return as promise object = handle as .then .catch

// const User = sequelize.define(
//   'Users',
//   {
//     id: {
//       // key name needs to be the same as in the table because we're mapping it together now. Else, you need to define another propeties to tell it - field.
//       type: DataTypes.INTEGER, // import datatype
//       primaryKey: true,
//       autoIncrement: true,
//       field: 'user_id',
//     },
//     name: {
//       type: DataTypes.STRING(255), // VARCHAR // default value = 255
//       allowNull: false,
//       field: 'username',
//     },
//   },
//   {
//     tableName: 'users',
//     timestamps: false, // tell that our table doesn't have createdAt & updatedAt because sequelize wil add these two automatically.
//   }
// ); // table's name, {properties in the table (column)} // mostly, the first letter of model's name will be uppercase

// User.findAll({})
//   .then((result) => {
// console.log(result);
// for (let el of result) {
//   console.log(el);
//   console.log('-----------');
//   console.log(el.dataValues.name);
//   console.log('-----------');
//   console.log(el.name); // no need dataValues, we can access the value directly.
// }
//     console.log(JSON.parse(JSON.stringify(result)));
//   })
//   .catch((err) => console.log(err)); // mapping and generate SQL methods for us automatically

//////////////
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDay: DataTypes.DATEONLY,
    gender: { type: DataTypes.ENUM('MALE', 'FEMALE'), allowNull: false },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { tablename: 'users', timestamps: false, underscored: true } //A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request.
  //   { tablename: 'users', underscored: true, paranoid: true }
);

// https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/

const Todo = sequelize.define(
  'Todo',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        test(value) {
          if (value.toLowerCase().includes('royal')) {
            throw new Error('title cannot contain "royal"');
          }
        },
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    userId: {
      // if have associate model no need to link foreign key like this.
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
  },
  { tableName: 'todos', timestamps: false, underscored: true }
);

// sequelize.sync()
// sequelize.sync({ alter: true }); // = it will create table based on our model for us.
// sequelize.sync({ force: true }); // = it will create table based on our model for us. // need to careful when using force = use it when creating new project, DO NOT use with existing databse just to be careful.
// sequelize.drop(); // drop the model we're currently mapping
// all of these know the model by .define() = if have many models, it will execute all of them.

// Model association
User.hasMany(Todo, { foreignKey: { allowNull: false, name: 'userId' } }); // = one user can have many Todo // name = name of the foreignKey
Todo.belongsTo(User, { foreignKey: { allowNull: false, name: 'userId' } }); // 1 associate has 2 items = need to write 2 code lines - back & front.

// one-one model A, B
// A.hasOne(B)
// B.belongsTo(A)

// Many-many model A, B, AB (= associated model)
// A.belongsToMany(B, {through: AB}) // need to tell
// B.belongsToMany(A, {through: AB})

// CREATE INSTANCE #1
// const user = new User() // X -> use build method instead.
// const user = User.build({
//   username: 'Leelee',
//   password: '4321',
//   gender: 'FEMALE',
// });
// Instance method - use with instance from class
// user.save(); // insert data into our database

const run = async () => {
  // because every method is asynchronous
  // Create as a class method // CREATE INSTANCE #2
  //   const user = await User.create({
  //     username: 'Best',
  //     password: '1234',
  //     gender: 'MALE',
  //   });
  //   // (variable, replacer function (null = no need to do replacer function), length - = modify spacing for reading user-friendly)
  //   console.log(JSON.parse(JSON.stringify(user, null, 2)));
  // Update Instance method #1
  //   const user = await User.findByPk(1); // Create (if no this primary key) +/ update
  //   console.log(JSON.parse(JSON.stringify(user)));
  //   user.password = '9384';
  //   user.status = false;
  //   await user.save();
  // #1.2
  //   const user = await User.findByPk(2);
  //   user.set({
  //     password: '9999',
  //     status: false,
  //     birthDay: new Date(2001 - 04 - 12),
  //   });
  //   await user.save();
  // Update Instance using class method #2
  //   const user = await User.update(
  //     {
  //       password: '94837',
  //       birthday: new Date(1987 - 09 - 23),
  //     },
  //     { where: { id: 5 } } // It does not create the new data for me, this method.
  //   );
  //   console.log(JSON.parse(JSON.stringify(user, null, 2))); // return effected rows.
  // DELETE - Instance method #1
  //   const user = await User.findByPk(6);
  //   await user.destroy();
  //   console.log(JSON.parse(JSON.stringify(user, null, 2)));
  // DELETE - class method #2
  //   const user = await User.destroy({ where: { id: 3 } });
  //   console.log(JSON.parse(JSON.stringify(user, null, 2)));
  // BULK CREATE - create multiple data lists
  //   const users = await User.bulkCreate([
  //     { username: 'Harry', password: '12312345', gender: 'MALE' },
  //     { username: 'Potter', password: '123345', gender: 'MALE' },
  //     { username: 'Violet', password: '123445', gender: 'FEMALE' },
  //   ]);
  // Select all data in the table: findAll, findOne
  //   const data = await User.findAll(); // *
  //   const data = await User.findOne(); // the first data
  //   const data = await User.findOne({ where: { id: 2 } });
  //   const data = await User.findOne({ where: { id: 2, username: Bic} }); AND operator
  // if want to use other operators such as OR -> need to import Op from sequelize i.e. Op.or
  //   const data = await User.findAll({
  //     where: {
  //       [Op.or]: [{ username: 'Leelee' }, { username: 'May' }],
  //       id: 1,
  //     },
  //   });
  //   const data1 = await User.findAll({
  //     where: {
  //       id: {
  //         [Op.ne]: 1,
  //       },
  //     },
  //   });
  //   const data = await User.findAll({
  //     where: {
  //       id: {
  //         [Op.gt]: 2,
  //       },
  //     },
  //   });
  //   const data = await User.findAll({
  //     where: {
  //       [Op.or]: [{ id: { [Op.gte]: 9 } }, { id: { [Op.lte]: 12 } }],
  //     },
  //   });
  //   const data = await User.findAll({
  //     where: {
  //       id: {
  //         [Op.between]: [9, 12],
  //       },
  //     },
  //   });
  //   const data = await User.findAll({
  //     where: {
  //       //   id: {
  //       // [Op.in]: [5, 9, 11],
  //       //  },
  //       //shorthand
  //       id: [5, 9, 11],
  //     },
  //   });
  //   const data = await User.findAll({
  //     where: {
  //       username: {
  //         [Op.like]: '%a%',
  //       },
  //     },
  //   });
  //   const data = await User.findAll({
  //     where: {
  //       id: [1, 4, 5, 6],
  //     },
  //     attributes: ['username', ['gender', 'type']], // select some columns + change column's name - AS
  //   });
  //   const data1 = await User.findAll({
  //     where: { id: [1, 4, 5, 6] },
  //     attributes: {
  //       exclude: ['birthDay'],
  //     }, // exclude some columns
  //   });
  // ORDER BY
  //   const data = await User.findAll({
  //     order: [['username', 'DESC']],
  //   });
  // GROUP BY
  //   const data = await User.findAll({
  //     attributes: ['gender'],
  //     group: ['gender'],
  //   });
  // Aggregrate function -> sequelize.fn - COUNT()
  //   const data = await User.findAll({
  //     attributes: ['gender', [sequelize.fn('COUNT', '*'), 'total']],
  //     group: ['gender'],
  //   });
  // MAX()
  //   const el2 = [sequelize.fn('COUNT', '*'), 'total'];
  //   const data = await User.findAll({
  //     attributes: [
  //       'gender',
  //       el2,
  //       [sequelize.fn('MAX', sequelize.col('id')), 'max'],
  //     ],
  //     group: ['gender'],
  //   });
  // LIMIT, OFFSET
  //   const data = await User.findAll({
  //     limit: 5,
  //     offset: 2,
  //   });
  //   const data = await Todo.create({
  //     title: 'Royal',
  //     userId: 1,
  //   });
  // RAW QUERIES
  //   const data = await sequelize.query(
  //     'SELECT gender, COUNT(*) AS total FROM users GROUP BY gender',
  //     { type: QueryTypes.SELECT } // will return only 1 value, not 2 values anymore
  //   ); // this sequelize is our const seqielize
  // replecments: -> send in the DOC
  //   const data = await sequelize.query(
  //     'INSERT INTO todos (title, user_id) VALUES (:title, :userId)',
  //     { type: QueryTypes.INSERT, replacements: { title: 'royal', userId: 5 } } // -> return [inserted id, effected row(/data)]
  //   ); // = validate won't be worked here in raw queries because raw SQL is not related with the models we have created
  //   console.log(JSON.parse(JSON.stringify(data, null, 2))); // return 2 elements same as mysql2 -> if used, result[0] because they designed it to return [results, metadata]

  // Paranoid
  //   await User.destroy({
  //     where: {
  //         id: 1
  //     }
  //   })

  // const data = await User.findByPk(1)
  // Paranoid will create deletedAt for us in the table, the data still there, but we can't write SQL to find it already
  // https://sequelize.org/docs/v6/core-concepts/paranoid/

  // Associations = select and join table = (1 write its relationshop) and select it
  //https://sequelize.org/docs/v6/core-concepts/assocs/
  // i.e. User has many Todo
  //   await Todo.bulkCreate([
  //     { title: 'Coding', userId: 5 },
  //     { title: 'Play Game', userId: 5 },
  //     { title: 'Shopping', userId: 7 },
  //     { title: 'Relax', userId: 7 },
  //     { title: 'Sleeping', userId: 10 },
  //   ]);
  //   const data = await Todo.findAll({ where: { id: 5 }, include: User }); // shorthand

  const data = await User.findAll({
    attributes: ['id', 'username', 'gender'],
    where: { id: 7 },
    include: {
      model: Todo,
      attributes: ['id', 'title', 'completed'],
    },
  });

  console.log(JSON.stringify(data, null, 2)); // JSON.parse should not be written here as it will convert it back into object again.
};

run();
