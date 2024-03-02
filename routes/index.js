var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.displayName}! <a href="/logout">Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.send('<a href="/auth/github">Login with GitHub</a><br><a href="/auth/google">Login with Google</a>');
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
