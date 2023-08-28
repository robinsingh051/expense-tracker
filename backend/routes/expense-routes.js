const express = require("express");

const expenseController = require("../controllers/expense-controller");

const router = express.Router();

// /expenses => GET
router.get("/expenses", expenseController.getExpenses);

// /expenses => POST
router.post("/expenses", expenseController.postExpenses);

// /expense/:id => GET
router.get("/expense/:id", expenseController.getExpense);

// /expense/:id => DELETE
router.delete("/expense/:id", expenseController.deleteExpense);

module.exports = router;
