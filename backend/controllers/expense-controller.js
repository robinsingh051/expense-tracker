const Expense = require('../models/expense');

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
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
        const newExpense = await Expense.create({
            expense: expense,
            desc: desc,
            cat: cat
        });
        console.log(newExpense.id);
        const createdExpense = await Expense.findByPk(newExpense.id);
        res.status(201).json(createdExpense);
    } catch (err) {
        console.log(err);
    }
};

exports.getExpense = async (req, res, next) => {
    const expenseId = req.params.id;
    try {
        const expense = await Expense.findByPk(expenseId);
        res.json(expense);
    } catch (err) {
        console.log(err);
    }
};

exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params.id;
    try {
        const expense = await Expense.findByPk(expenseId);
        await expense.destroy();
        res.status(204).json({ success: "Expense is deleted" });
    } catch (err) {
        console.log(err);
    }
};
