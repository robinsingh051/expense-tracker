const Razorpay = require("razorpay");
const Order = require("../models/order");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: "rzp_test_Xgq3eix2NfBDHd",
      key_secret: "VjD8EMpJV59FTeW2aVSBfcmU",
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatetransactionstatus = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({
      where: { orderid: req.body.order_id },
    });
    const order = orders[0];
    order.orderid = req.body.order_id;
    order.paymentid = req.body.payment_id;
    order.status = "SUCCESS";
    order.save();
    req.user.ispremium = true;
    req.user.save();
    res.status(200).json({ message: "paymant successful" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};
