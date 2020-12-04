var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("2020", { title: "Chorizo Burrito" });
});

module.exports = router;
