//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const path = require("path");

// parser
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

// import route
const userRoute = require("./routes/users")
const wordRoute = require("./routes/words")
const animationRoute = require("./routes/animations")
const validateLogRoute = require("./routes/validateLogs")
const authRoute = require("./routes/authRoutes");
const { checkUser, requireAuth } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(express.static('public'))
app.use(cors());
app.use(cookieParser())
app.use(express.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/file", express.static(path.join(__dirname, "/Uploaded/")));


mongoose.set("strictQuery", true);
// app.use(express.static("public"));

// view engine
app.set('view engine', 'ejs')

// Database Connection
const dbURI = "mongodb://127.0.0.1:27017/tslDB"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Server started on port 3333")
    app.listen(3333)
  })
  .catch((err) => console.log(err))

// Routes
app.use('*', checkUser)
app.use(userRoute);
app.use(wordRoute);
app.use(animationRoute);
app.use(validateLogRoute);
app.use(authRoute) 
app.get('/', (req, res) => {
  res.render('home')
})
app.get('/content', requireAuth, (req,res) => {
  res.render('content')
})
