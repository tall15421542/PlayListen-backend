import express from 'express'
import { Google } from './google'
import { Facebook } from './facebook'
import passport from 'passport'

var router = express.Router();
router.use('/google', Google);
router.use('/facebook', Facebook);
router.use('/signOut', function(req, res){
  if(req.logout){
    req.logout()
  }
  if(req.session && req.session.authResult){
    delete req.session.authResult
  }
  console.log(req.session)
  res.json({})
})

export { router as Auth }
