const express = require("express");
const { checkout, paymentVerification } = require("../controllers/paymentController");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router2 = express.Router();

router2.post("/checkout", checkout);
router2.post("/paymentverification", paymentVerification); 

module.exports = router2;
