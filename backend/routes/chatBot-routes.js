const express= require("express");
const { chatBot } = require("../controllers/chatbot-controller");
const router = express.Router();

router.post("/chatBot",chatBot);
module.exports= router;