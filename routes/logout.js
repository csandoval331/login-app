var express = require('express');
const { route } = require('.');
var router = express.Router()

router.get('/',(req,res)=>{
    req.logout();
    res.redirect('/')
})

module.exports = router