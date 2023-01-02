//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption")

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true); // suppress warning. not required in lesson
mongoose.connect("mongodb://127.0.0.1:27017/userDB")

// Create Schema and Model -------------

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// *****------------- LEVEL 2 Environment Variables   --------------------------------
//console.log(process.env.SECRET) -> prints out the SECRET from .env file
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); // has to be here BEFORE Model is created bcos Model takes in userSchema properties.

const User = new mongoose.model("User", userSchema);

// ------------------app.get ----------------------------------------
app.get("/", function(req, res){
  res.render("home");
});


app.get("/register", function(req, res){
  res.render("register");
});


app.get("/login", function(req, res){
  res.render("login");
});






// ------------------app.post ----------------------------------------
app.post("/register", function(req, res){
  // Create new user Document
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (!err){
      res.render("secrets")
    } else {
      res.send(err)
    }
  })
})

app.post("/login", function(req, res){
  // Check if user exists
  const username = req.body.username
  const password = req.body.password
  User.findOne({email: username}, function(err, foundUser){
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets")
      } else {
        console.log("Password is incorrect.")
      }
    } else {
      console.log("User doesn't exist. Please register")
    }
  })
})
















// ------------------app.listen ----------------------------------------
app.listen(3000, function() {
  console.log("Server started on port 3000")
})
