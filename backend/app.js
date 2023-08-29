const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");
const purchaseRoutes = require("./routes/purchase-routes");
const passwordRoutes = require("./routes/password-routes");
const authenticationMiddleware = require("./util/authentication");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgetpasswordRequest = require("./models/forgetpasswordrequest");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/password", passwordRoutes);
app.use("/users", userRoutes);
app.use("/purchase", authenticationMiddleware, purchaseRoutes);
app.use(authenticationMiddleware, expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetpasswordRequest);
ForgetpasswordRequest.belongsTo(User);

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
