const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportConf = require('../passport')   //TO REQUIRE CONTENTS OF PASSPORT.JS FILE
const {validateBody,schemas} = require('../helpers/routeHelpers')
const UserController = require('../controllers/users')

const passportJWT = passport.authenticate('jwt', { session: false });
const passportLocal = passport.authenticate('local', { session: false });
const passportGoogle = passport.authenticate('googleToken',{session:false})
const passportFacebook = passport.authenticate('facebookToken',{session:false})
const passportGoogleAuthorize = passport.authorize('googleToken',{session:false})
const passportFacebookAuthorize = passport.authorize('facebookToken',{session:false})


router.get('/status',passportJWT,UserController.checkAuthentication)
router.post('/signup',validateBody(schemas.authSchema),UserController.signUp)
router.post('/signin',validateBody(schemas.authSchema),passportLocal,UserController.signIn)
router.get('/dashboard',passportJWT,UserController.dashboard)
router.post('/oauth/google',passportGoogle,UserController.googleOAuth)
router.post('/oauth/facebook',passportFacebook,UserController.facebookOAuth)
router.post('/oauth/link/google',passportJWT,passportGoogleAuthorize,UserController.linkGoogle)
router.post('/oauth/link/facebook',passportJWT,passportFacebookAuthorize,UserController.linkFacebook)
router.post('/oauth/unlink/google',passportJWT,UserController.unLinkGoogle)
router.post('/oauth/unlink/facebook',passportJWT,UserController.unLinkFacebook)
router.get('/signout',passportJWT,UserController.signOut)

module.exports = router
