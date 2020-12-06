const mongoose = require("mongoose");

// DB connect 
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useFindAndModify:false,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.log(err);
}
}

module.exports = connectDB;
