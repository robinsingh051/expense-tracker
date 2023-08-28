const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");
const authenticationMiddleware = require("./util/authentication");

const User = require("./models/user");
const Expense = require("./models/expense");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use("/users", userRoutes);
app.use(authenticationMiddleware);
app.use(expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

// Sync the database models
sequelize
  .sync()
  .then(() => {
    // Start the server
    app.listen(3000);
  })
  .catch((error) => {
    console.error(error);
  });
