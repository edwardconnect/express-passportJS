var express = require('express');
var router = express.Router();
import passport from 'passport';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',passport.authenticate('local', {session: false}), (req, res) => {
  const {user} = req;
  console.log(user);

  return res.json({a:'a'});
})

// router.get('/login', passport.authenticate('jwt', {session: false}))


module.exports = router;
