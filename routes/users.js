var express = require('express');

var router = express.Router();

const { User } = require('../utils/model')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await User.findAll()
  res.send(users);
});

module.exports = router;
