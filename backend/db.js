//DATABASE CONNECTION
const mongoose = require('mongoose')
const keys = require('./keys')
const connectDB = async () => {
    try{
        const url = keys.mongo.id
       const conn = await mongoose.connect(url,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
       } ) 
       console.log("Connected to database")
    }catch(err) {
        console.log(`Error ${err.message}`)
        process.exit(1); //EXIT WITH FAILURE
    }
}

module.exports = connectDB; 


