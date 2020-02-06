import passport from "passport"
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import express from 'express' 
import Model from '../models/index'
import { createToken, getLoginUser, user_database_to_authentication_result, user_database_to_graphql } from '../models/User'
import querystring from 'querystring'

var model = new Model()
var router = express.Router();
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true,
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    var user = await getLoginUser(req);
    // login
    if(user){
      await model.user.connectGoogle(user.id, {accessToken: accessToken, refreshToken: refreshToken, id: profile.id}); 
      return done(null, user);
    }
    // not log in
    else{
      const user = await model.user.getByGoogleId(profile.id)
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

router.get('/', passport.authenticate('google', { 
  scope: ['https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/photoslibrary.readonly'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/callback',
  passport.authenticate('google', { failureRedirect: 'Unauthorized'}),
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

export { router as Google }
