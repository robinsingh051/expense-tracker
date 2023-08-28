const User = require("../models/user");

exports.postSignUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name, email, password);
  try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });
    console.log(newUser.id);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(409).json({ error: "User with this email already exists" });
  }
};
