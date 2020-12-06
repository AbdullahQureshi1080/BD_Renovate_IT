const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const connectDB = require('./config/db');

// --------- Load Config
dotenv.config({path:"./config/config.env"});

// --------- Passport Config
require("./config/passport")(passport);

connectDB();

const app = express();

// --------- Logger
app.use(morgan());


// --------- Import Routes
const authRoute = require("./routes/auth");
const postRoute = require('./routes/posts')


// --------- Middlewares
app.use(express.json());



// App Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// Passport Middlewares
app.use(passport.initialize());
// app.use(passport.session());


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
