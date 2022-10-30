const express = require("express");
const cors = require('cors');
const {validateTicket} = require("../controller/ticketController");

const router = express.Router();

router.post("/check_payment", validateTicket);




//HEllo Change
module.exports = router;
