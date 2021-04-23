const express = require('express');
const morgan = require('morgan')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const path = require('path')
const connectDB = require('./db')
const users = require('./routes/users')
const dotenv = require('dotenv')
dotenv.config()
connectDB();

//MIDDLEWARE
app.use(cors({ origin: 'http://localhost:3000', credentials: true})) 
app.use(cookieParser());
app.use(express.json())
app.use(morgan('dev'))


//ROUTES
app.use('/users',users)

//START THE SERVER
const port = process.env.PORT || 5000
app.listen(port,() => console.log(`Server running on PORT ${port}`))