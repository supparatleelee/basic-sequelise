const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('lab_expense_tracker', 'root', 'Supparat28', {
  host: 'localhost',
  dialect: 'mysql',
});

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    type: {
      type: DataTypes.ENUM('INCOME', 'EXPENSE'),
      allowNull: false,
      defaultValue: 'EXPENSE',
    },
  },
  {
    underscored: true,
    tableName: 'Categories',
    paranoid: true,
  }
);

const Transaction = sequelize.define(
  'Transaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
  },
  {
    underscored: true,
    tableName: 'Transactions',
  }
);

Category.hasMany(Transaction, {
  foreignKey: { allowNull: false, name: 'categoryId' },
});
Transaction.belongsTo(Category, {
  foreignKey: { allowNull: false, name: 'categoryId' },
});

// sequelize.sync({ alter: true });

const run = async () => {
  //   await Category.bulkCreate([
  //     { title: 'Salary', type: 'INCOME' },
  //     { title: 'Food', type: 'EXPENSE' },
  //     { title: 'Freelance', type: 'INCOME' },
  //   ]);

  await Transaction.bulkCreate([
    {
      payee: 'Google',
      amount: 10000,
      date: new Date(2022 - 09 - 23),
      categoryId: 1,
    },
    {
      payee: 'Facebook',
      amount: 10000,
      date: new Date(2022 - 04 - 10),
      categoryId: 2,
    },
    {
      payee: 'Line Man',
      amount: 10000,
      date: new Date(2022 - 03 - 03),
      categoryId: 3,
    },
  ]);

  const data = await Category.findAll({
    attributes: ['id', 'title', 'type'],
    where: { id: 2 },
    include: {
      model: Transaction,
      attributes: ['id', 'payee', 'amount', 'date'],
    },
  });

  console.log(JSON.stringify(data, null, 2));
};

run();
