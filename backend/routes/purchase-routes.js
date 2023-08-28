const express = require("express");

const purchaseController = require("../controllers/purchase-controller");

const router = express.Router();

// /purchase/premiummembership => POST
router.get("/premiummembership", purchaseController.purchasePremium);

// purchase/updatetransactionstatus => POST
router.post(
  "/updatetransactionstatus",
  purchaseController.updatetransactionstatus
);

module.exports = router;
