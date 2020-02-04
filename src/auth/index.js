import express from 'express'
import { Google } from './google'
import { Facebook } from './facebook'

var router = express.Router();
router.use('/google', Google);
router.use('/facebook', Facebook);

export { router as Auth }
