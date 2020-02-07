import passport from "passport"
import { Strategy as FacebookStrategy } from 'passport-facebook'
import express from 'express' 
import Model from '../models/index'
import { createToken, getLoginUser, user_database_to_authentication_result, user_database_to_graphql } from '../models/User'
import querystring from 'querystring'

var model = new Model()
var router = express.Router();
router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL, 
    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name'] 
  },
  async function(req, accessToken, refreshToken, profile, done) {
    const user = await model.user.getByFacebookId(profile.id)
    if(user) return done(null, user_database_to_authentication_result(user))
    return done(null, {
      result: 'facebookSignUp',
      token: null,
      user: {
        facebookAccessToken: accessToken,
        facebookId: profile.id,
        email: profile.emails[0].value
      }
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  console.log("deserial")
  done(null, user);
});

router.get('/', passport.authenticate('facebook', { 
  scope: ['email'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: process.env.FACEBOOK_FAIL_REDIRECT_URL}),
  function(req, res) {
    req.session.authResult = req.user
    res.redirect(process.env.FACEBOOK_SUCCESS_REDIRECT_URL)
  });

export { router as Facebook }
