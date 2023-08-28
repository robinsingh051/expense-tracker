const Expense = require("../models/expense");

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.postExpenses = async (req, res, next) => {
  const expense = req.body.expense;
  const desc = req.body.desc;
  const cat = req.body.cat;
  console.log(expense, desc, cat);
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const newExpense = await req.user.createExpense({
      expense: expense,
      desc: desc,
      cat: cat,
    });
    console.log(newExpense.id);
    res.status(201).json(newExpense.get());
  } catch (err) {
    console.log(err);
  }
};

exports.getExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  try {
    const expenses = await req.user.getExpenses({ where: { id: expenseId } });
    res.json(expenses[0]);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  try {
    const expenses = await req.user.getExpenses({ where: { id: expenseId } });
    await expenses[0].destroy();
    res.status(204).json({ success: "Expense is deleted" });
  } catch (err) {
    console.log(err);
  }
};
