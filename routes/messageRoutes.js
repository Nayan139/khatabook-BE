const express = require("express");
const router = express.Router();
const { sendMessage, getTextMessageInput } = require("../helper/MessageHelper");

const api = process.env.API;

router.post(`${api}/reminder/whatsapp`, function (req, res, next) {
  var data = getTextMessageInput(
    process.env.RECIPIENT_WAID,
    "Welcome to the khata-book App for Node.js!"
  );

  sendMessage(data)
    .then(function (response) {
      console.log("response is here----------->", response);
      res
        .status(200)
        .json({
          success: true,
          message: "Message Passed SuccessFully",
          response: response,
        });
      return;
    })
    .catch(function (error) {
      console.log("@@@@@@@@@@@@@@@@@",error);
      console.log("==========================================",error.response.data);
      res.sendStatus(500);
      return;
    });
});

module.exports = router;
