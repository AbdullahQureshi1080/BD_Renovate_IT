const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// const passport = require("passport");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
 
// --------- Load Config
dotenv.config({ path: "./config/config.env" });
 
// --------- Passport Config
// require("./config/passport")(passport);
 
// Connect to DB
connectDB();
 
// --------- Initialize Express
const app = express();
 
// --------- Logger
app.use(morgan());
 
// --------- Cors
app.use(cors());
 
// --------- Import Routes
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const postRoute = require("./routes/posts");
const projectRoute = require("./routes/projects");
const chatRoute = require("./routes/chats");
const remoteFirmRoute = require("./routes/remoteFirm");
const shopRoute = require("./routes/shop");


// --------- Middlewares
app.use(express.json());

app.use(bodyParser.json());
 
// Passport Middlewares
// app.use(passport.initialize());
// app.use(passport.session());
 
// App Middlewares
app.use("/api/user", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postRoute);
app.use("/api/projects", projectRoute);
app.use("/api/chats", chatRoute);
app.use("/api/remoteFirm", remoteFirmRoute);
app.use("/api/shop", shopRoute);

// app.use("/api/cloudStorage", cloudStorage);
 
// Port/Host Connection
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST_IP;
app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
