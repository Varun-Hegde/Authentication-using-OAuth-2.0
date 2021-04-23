const JWT = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const User = require('../models/users');
const { deleteOne } = require('../models/users');

const signToken = (user) => {
    const token = JWT.sign({
        iss: 'Varun Hegde',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate()+1)   // current time + 1 day ahead
    },'qwefdshghntzcscsdn');
    return token;
}

module.exports.signUp = asyncHandler (async (req,res) => {
    const {email,password} = req.value.body
    
    //Check if user exists
    let foundUser = await User.findOne({'local.email' : email})
    if(foundUser){
        return res.status(403).json({error:'Email is aldready in use'})
    }
//res.cookie('access_token', token, {sameSite: 'strict',path: '/',httpOnly:true,secure:true),
    //Check if user exists with same google email
    foundUser = await User.findOne({"google.email": email});
    if(foundUser){
        //merge them
        foundUser.methods.push('local')
        foundUser.local = {
            email: email,
            password:password
        }
        await foundUser.save()
        const token = signToken(createdUser);
        res.cookie('access_token',token,{sameSite: 'strict',path: '/',httpOnly:true})
        res.json({success: 'true' })
    }

    //Check if user exists with same facebook email
    foundUser = await User.findOne({"facebook.email": email});
    if(foundUser){
        //merge them
        foundUser.methods.push('local')
        foundUser.local = {
            email: email,
            password:password
        }
        await foundUser.save()
        const token = signToken(createdUser);
        res.cookie('access_token',token,{sameSite: 'strict',path: '/',httpOnly:true})
        res.json({success: 'true' })
    }

    const newUser = new User({
        methods: ['local'],
        local:{
            email:email,
            password: password
        }
    })
    const createdUser = await newUser.save()
    const token = signToken(createdUser);
    res.cookie('access_token',token,{sameSite: 'strict',path: '/',httpOnly:true})
    res.json({success: 'true' })
 })

module.exports.signIn = asyncHandler (async (req,res) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{sameSite: 'strict',path: '/',httpOnly:true})
    res.json({success: 'true' })
})

module.exports.dashboard = asyncHandler (async (req,res) => {
    console.log('I MANAGED TO GET HERE');
    console.log(req.user);
    res.json({ secret:"resource",methods: req.user.methods,user:req.user });
})

module.exports.googleOAuth = asyncHandler(async(req,res) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{sameSite: 'strict',path: '/',httpOnly:true})
    res.json({success: 'true' })
})

module.exports.facebookOAuth = asyncHandler(async(req,res) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{sameSite: 'strict',path: '/',httpOnly:true})
    res.json({success: 'true' })
})

module.exports.linkGoogle = asyncHandler(async (req,res) => {
    res.json({success: true,methods:req.user.methods,message: 'Successfully linked account with google'})
})


module.exports.linkFacebook = asyncHandler(async (req,res) => {
    res.json({success: true,methods:req.user.methods,message: 'Successfully linked account with facebook'})
})

module.exports.unLinkGoogle = asyncHandler(async (req,res) => {
    if (req.user.google) {
      req.user.google = undefined
    }
    // Remove 'google' from methods array
    const googleStrPos = req.user.methods.indexOf('google')
    if (googleStrPos >= 0) {
      req.user.methods.splice(googleStrPos, 1)
    }
    await req.user.save()

    // Return something
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Google' 
    });
}) 

module.exports.unLinkFacebook = asyncHandler(async (req,res) => {
    // Delete Facebook sub-object
    if (req.user.facebook) {
      req.user.facebook = undefined
    }
    // Remove 'facebook' from methods array
    const facebookStrPos = req.user.methods.indexOf('facebook')
    if (facebookStrPos >= 0) {
      req.user.methods.splice(facebookStrPos, 1)
    }
    await req.user.save()

    // Return something?
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Facebook' 
    });
}) 

module.exports.checkAuthentication = asyncHandler ((req,res) => {
    res.json({ 
      success: true,
      user: req.user
    });
})

module.exports.signOut = asyncHandler((req,res) => {
    res.clearCookie('access_token')
    res.json({success:true})
})