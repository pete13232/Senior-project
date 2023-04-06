//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const path = require("path");

// import route
const userRoute = require("./routes/users")
const wordRoute = require("./routes/words")
const animationRoute = require("./routes/animations")
const validateLogRoute = require("./routes/validateLogs")
const authRoute = require("./routes/auth")


const app = express();

// Middleware
app.use(cors());
app.use(express.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/file", express.static(path.join(__dirname, "/Uploaded/")));

mongoose.set("strictQuery", true);
// app.use(express.static("public"));


// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/tslDB", { useNewUrlParser: true });


// Routes
app.use(userRoute);
app.use(wordRoute);
app.use(animationRoute);
app.use(validateLogRoute);
app.use(authRoute)


app.listen(3333, function () {
  console.log("Server started on port 3333");
});
