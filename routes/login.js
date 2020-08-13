var express = require('express')
var passport = require('passport')
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('login')
})

router.post('/',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{
    console.log("hello from login post",req.body)
    res.redirect('/')
})

module.exports = router