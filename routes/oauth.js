const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // 登录成功，重定向到首页
    res.redirect('/');
  }
);

module.exports = router;
