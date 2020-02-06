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
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    var user = await getLoginUser(req);
    // login
    if(user){
      await model.user.connectFacebook(user.id, {accessToken: accessToken, id: profile.id}); 
      return done(null, user);
    }
    // not log in
    else{
      const user = await model.user.getByFacebookId(profile.id)
      if(user){
        return done(null, user_database_to_graphql(user));
      }
      else{
        return done(null, null);
      }
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await model.user.getById(id);
  done(null, user_database_to_graphql(user));
});

router.get('/', passport.authenticate('facebook', { 
  scope: [],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: 'Unauthorized'}),
  function(req, res) {
    req.session.user = req.user
    req.session.token = createToken(req.user)
    req.session.result = 'success'
    res.json(req.session)
  });

router.get('/Unauthorized', function(req, res){
  req.session.user = null
  req.session.token = null
  req.session.result = 'failed'
  res.json(req.session) 
})

export { router as Facebook }
