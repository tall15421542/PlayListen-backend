import passport from "passport"
import { Strategy as FacebookStrategy } from 'passport-facebook'
import express from 'express' 
import Model from '../models/index'
import { createToken, getLoginUser, user_database_to_authentication_result, user_database_to_graphql } from '../models/user'
import querystring from 'querystring'

var model = new Model()
var router = express.Router();

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL, 
    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name'] 
  },
  async function(req, accessToken, refreshToken, profile, done) {
    const user = await model.user.getByFacebookId(profile.id)
    if(user) return done(null, user)
    else{
      req.session.authResult = {
        result: 'facebookSignUp',
        token: null,
        user:{
          facebookAccessToken: accessToken,
          facebookId: profile.id,
          email: profile.emails[0].value
        }
      }
    }
    return done(null, null);
  }
));

router.get('/', passport.authenticate('facebook', { 
  scope: ['email'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: process.env.FACEBOOK_FAIL_REDIRECT_URL}),
  function(req, res) {
    if(req.user){
      req.session.authResult = user_database_to_authentication_result(req.user)
    }
    res.redirect(process.env.FACEBOOK_SUCCESS_REDIRECT_URL)
  });

router.get('/user', (req, res) => {
  console.log(req.session.authResult)
  if (req.session && req.session.authResult) {
    res.json(req.session.authResult);
  } else {
    res.json({ result: 'failed' });
  }
});

export { router as Facebook }
