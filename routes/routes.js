const express = require("express");
const cors = require('cors');
const {validateTicket} = require("../controller/ticketController");
const {sendEmail} = require("../controller/mailController");

const router = express.Router();

router.post("/check_payment", validateTicket);
router.post("/sendmail", sendEmail);


module.exports = router;
