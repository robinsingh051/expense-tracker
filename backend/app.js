const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");

const app = express();

const usersRoutes = require("./routes/users-routes");

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use("/users", usersRoutes);

sequelize
  .sync()
  .then((result) => {
    //console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
