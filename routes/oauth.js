const express = require('express');
const passport = require('passport');
const router = express.Router();

const Jwt = require('../utils/jwt');

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login',session: false }),
  function(req, res) {
    // 设置jwt token
    const token = Jwt.sign(req.user)
    res.cookie(process.env.JWT_HEADER_KEY, token)
    // 登录成功，重定向到首页
    res.redirect('/');
  }
);

module.exports = router;
