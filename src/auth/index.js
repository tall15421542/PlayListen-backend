import express from 'express'
import { Google } from './google'
import { Facebook } from './facebook'
import passport from 'passport'

var router = express.Router();
router.use('/google', Google);
router.use('/facebook', Facebook);
router.use('/signOut', function(req, res){
  req.logout()
  res.redirect(process.env.SIGNOUT_REDIRECT_URL)
})

export { router as Auth }
