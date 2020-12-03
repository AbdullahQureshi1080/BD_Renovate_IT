const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const app = express();

// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require('./routes/posts')


dotenv.config();

// DB connect 
mongoose.connect(
process.env.DB_CONNECT,
{useNewUrlParser: true,
useUnifiedTopology:true,
},

()=>{ console.log("Connected to DB !");})



// Middlewires
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
