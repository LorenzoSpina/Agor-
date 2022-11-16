const express = require("express");
const rateLimit = require('express-rate-limit')
const { addMessage, getMessages } = require("../controllers/chat.controller");
const { verifyToken } = require("../middlewares/middleware_auth/authJwt");

const router = express.Router();

router.route("/addmsg").post(verifyToken, addMessage);
router.route("/getmsg").get(verifyToken, getMessages);

module.exports = router;