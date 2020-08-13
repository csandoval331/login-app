var express = require('express')
var router = express.Router();
var User = require('../models/User')

router.get('/',(req,res)=>{
    res.render('register')
})

router.post('/',async(req,res)=>{
    console.log("register login",req.body)
    var {username,password,firstname,lastname,email} = req.body
    var newUser = await new User({username, password,firstname,lastname,email}).save();
    console.log("new user",newUser)

    res.render('register')
})

module.exports = router