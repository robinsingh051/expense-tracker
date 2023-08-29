const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "yourSecretKey";
const nodemailer = require("nodemailer");

const User = require("../models/user");
const ForgetPasswordRequest = require("../models/forgetpasswordrequest");
const sequelize = require("../util/database");

exports.postUsers = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name, email, password);
  const t = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(
      {
        name: name,
        email: email,
        password: hashedPassword,
        totalExpense: 0,
        ispremium: false,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res
      .status(409)
      .json({ error: "User with this email already exists" });
  }
};

exports.getUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res
        .status(401)
        .json({ error: "Incorrect password", success: false });
    } else {
      const token = jwt.sign(user.id, secretKey);
      return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token: token,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.forgetpassword = async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  try {
    const user = await User.findOne({ where: { email: email } });
    const forgetpasswordrequest = await ForgetPasswordRequest.create({
      userId: user.id,
    });
    const uuid = forgetpasswordrequest.id;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "baskin.notif@gmail.com",
        pass: "kgjtkdyobgffnqjg",
        authMethod: "LOGIN",
      },
    });
    const mailConfirm = {
      from: "baskin.notif@gmail.com",
      to: email,
      subject: "Change your password using given link",
      html: `
        <html>
          <head>
          </head>
          <body>
            <p>http://localhost:3000/password/resestpassword/${uuid}</p>
          </body>
        </html>  `,
    };
    const info = await transporter.sendMail(mailConfirm);
    console.log(info);
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed" });
  }
};

exports.dowload = async (req, res, next) => {};
