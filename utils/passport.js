const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const port = process.env.PORT || 3000;
const { User, Authentication } = require('./model')

passport.use(new GitHubStrategy({
    clientID: process.env.OAUTH_GITHUB_CLIEND_ID,
    clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    callbackURL: `http://127.0.0.1:${port}/auth/github/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    const { provider } = profile;
    // 在这里，你可以根据 profile 信息查找或创建用户
    const users = await Authentication.findAll({
        where: {
            identifier: profile.id,
            provider
        }
    })
    let user;
    if(users.size() == 0){
        //新增用户和授权记录
        user = await User.create({
            name: profile.username,
            email: profile.emails[0].value
        })
        const auth = await Authentication.create({
            userId: user.id,
            provider
        })
    }else {
        user = users[0];
    }
    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;