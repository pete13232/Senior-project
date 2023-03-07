//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors')
const router = express.Router();


const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.set('strictQuery', true)
// app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/tslDB", { useNewUrlParser: true })

app.use('/users', require('./routes/users'))
app.use('/words', require('./routes/words'))
app.use('/animations', require('./routes/animations'))
app.use('/validateLogs', require('./routes/validateLogs'))

app.listen(3333, function () {
    console.log("Server started on port 3333");
});