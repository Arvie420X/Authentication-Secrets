// in this case we're not actually setting a constant for it because all we need to do is just require it and then call config on it and we don't need it ever again. It will be active and running and all we need to do now is to define our environment variable
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
 
const app = express();
 
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
 

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Level 2
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]}); // it's important that you add this plugin to the schema before you create your Mongoose model because you can see that we're passing in the userSchema as a parameter to create our new Mongoose model


const User = mongoose.model("User", userSchema);
//



app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    
    newUser.save(err => {
        if(err) {
            console.log(err)
        } else {
            res.render("secrets");
        }
    });
});


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
})







app.listen(3000, function() {
    console.log("Server started on port 3000.");
});