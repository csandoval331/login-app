var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  
  var usr = req.session.passport.user
  // console.log("locals",res.locals.user)
  // console.log("req.session.user",JSON.stringify(req.session.passport.user))
  // var temp = res.locals
  res.render('index', {user:usr});
});

module.exports = router;
