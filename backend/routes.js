const express = require("express");
const router = express.Router();

router.route("/expression").get((request, response) => {
  response.status(400).send("Success");
});
module.exports = router;
