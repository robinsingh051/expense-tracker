const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use("/users", userRoutes);
app.use("/", expenseRoutes);

try {
  // Sync the database models
  await sequelize.sync();
  // Start the server
  app.listen(3000);
} catch (error) {
  console.error(error);
}
