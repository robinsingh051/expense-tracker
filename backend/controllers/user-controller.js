const User = require("../models/user");

exports.postUsers = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name, email);
  try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return res
      .status(409)
      .json({ error: "User with this email already exists" });
  }
};

exports.getUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
};
