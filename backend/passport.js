const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local')
//const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;

const User = require('./models/users')
const keys = require('./keys')
 
const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies.access_token
    }
    return token;
}

//JWT STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'qwefdshghntzcscsdn',
    passReqToCallback: true
},async (req,payload,done) => {
    try{
        //Find the user specified in token
        
        const user = await User.findById(payload.sub);

        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }

        // Otherwise, return the user
        req.user = user
        done(null, user);

    }catch(error){
        done(error,false);
    }
}));


//LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'    //authenticate using email.By default it is username
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "local.email": email });
    
    // If no user, handle it
    if (!user) {
      return done(null, false);
    }
  
    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);
  
    // If not, handle it
    if (!isMatch) {
      return done(null, false);
    }
  
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}))



//FOR GOOGLE AUTH,GO TO  https://console.developers.google.com/ and use Google+ API
//TO GET AN accesToken for testing go to google oauth playground and use Google OAuth2 API v2
//Send this token to /oauth/google in body as: {"access_token": token-value}
//GOOGLE OAUTH STRATEGY
passport.use('googleToken',new GoogleStrategy({
        clientID : keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL : '/auth/google/redirect',
        passReqToCallback: true
},async (req,accessToken,refreshToken,profile,done) => {
    try{
        //Could get accessed in 2 ways:
        // 1. When registering for 1st time
        // 2. When linking account to existing one
        
        if(req.user){
            //Aldready logged in,need to link account
            //Add google's data to an existing account
            req.user.methods.push('google')
            req.user.google = {
                id: profile.id,
                email:profile.emails[0].value
            }
            await req.user.save()
            done(null,req.user)
        }else{
            //In account creation process

            //CHECK WHETHER THIS USER EXISTS IN OUR DB
            let existingUser = await User.findOne({ "google.id":profile.id})
            if(existingUser){
                return done(null,existingUser)
            }

            //Check if we have someone with the same email
            existingUser = await User.findOne({"local.email":profile.emails[0].value})
            if(existingUser){
                //We need to merge google's data with local auth
                existingUser.methods.push('google')
                existingUser.google = {
                    id: profile.id,
                    email: profile.emails[0].value
                }
                await existingUser.save()
                return done(null,existingUser)
            }

            //IF NEW ACCOUNT    
            const newUser = new User({
                methods: ['google'],
                google:{
                    id: profile.id,
                    email:profile.emails[0].value
                }
            })
            await newUser.save()
            done(null,newUser)
        }
    }catch(err){
        done(err,false,err.message)
    }
}))  


//FOR FACEBOOK AUTH,GO TO  https://developers.facebook.com/ and use Facebook Login
//TO GET AN accesToken for testing go to https://developers.facebook.com/tools/explorer/ 
//Send this token to /oauth/facebook in body as: {"access_token": token-value}
//FACEBOOK OAUTH STRATEGY
passport.use('facebookToken',new FacebookTokenStrategy({
    clientID:keys.facebook.clientID ,
    clientSecret: keys.facebook.clientSecret,
    fbGraphVersion: 'v3.0',
    passReqToCallback: true
}, async(req,accessToken,refreshToken,profile,done) => {
    try{
        
        //Could get accessed in 2 ways:
        // 1. When registering for 1st time
        // 2. When linking account to existing one
      
        if(req.user){
            //Aldready logged in,need to link account
            //Add facebook's data to an existing account
            req.user.methods.push('facebook')
            req.user.facebook = {
                id: profile.id,
                email:profile.emails[0].value
            }
            await req.user.save()
            done(null,req.user)
        }else{
            //In account creation process

            //CHECK WHETHER THIS USER EXISTS IN OUR DB
            let existingUser = await User.findOne({ "facebook.id":profile.id})
            if(existingUser){
                return done(null,existingUser)
            }

            //Check if we have someone with the same email
            existingUser = await User.findOne({"local.email":profile.emails[0].value})
            if(existingUser){
                //We need to merge facebook's data with local auth
                existingUser.methods.push('facebook')
                existingUser.facebook = {
                    id: profile.id,
                    email: profile.emails[0].value
                }
                await existingUser.save()
                return done(null,existingUser)
            }

            //IF NEW ACCOUNT    
            const newUser = new User({
                methods: ['facebook'],
                facebook:{
                    id: profile.id,
                    email:profile.emails[0].value
                }
            })
            await newUser.save()
            done(null,newUser)
        }
    }catch(err){
           done(err,false,err.message)
    }
}))