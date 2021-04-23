const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    methods :{
        type: [String],
        required: true,
    },
    local:{
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        }
    },
    google:{
        id:{
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook:{
        id:{
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    
});


userSchema.pre('save',async function(next){
    try{
        if(!this.methods.includes('local')){
            next();
        }

        //GENERATE A SALT
        if(this.isModified('local.password')){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.local.password,salt)
            this.local.password = hashedPassword    
        }
        
        next()
    }catch(err){
        next(err);
    }
})

userSchema.methods.isValidPassword = async function(newPassword) {
    try{
       return await bcrypt.compare(newPassword,this.local.password)
    }catch(error){
        throw new Error(error)
    }
}

const User = mongoose.model('user',userSchema)

module.exports = User