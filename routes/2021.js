var express = require("express");
var THREE = require("three");
var router = express.Router();
const scene = new THREE.Scene();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("2021", { title: "Chorizo Burrito", THREE: THREE, scene: scene });
});

module.exports = router;
