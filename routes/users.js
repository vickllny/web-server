var express = require('express');

var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.send("user list.");
});

module.exports = router;
