const express = require("express");
const cors = require('cors');
const {validateTicket, counterValidation, meal_counter} = require("../controller/ticketController");
const {sendEmail} = require("../controller/mailController");

const router = express.Router();

router.post("/check_payment", validateTicket);
router.post("/counter_api", counterValidation);
router.post("/get-cert", validateCert);
router.post("/sendmail", sendEmail);

module.exports = router;
