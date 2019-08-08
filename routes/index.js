var express = require('express');
var router = express.Router();
import Account from '../models/account';
import User from '../models/user';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import JWT_CONFIG from '../configs/jwt';

const generateToken = user => {
  const payload = {
    id: user.id
  }

  return jwt.sign(payload, 'hello world');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register', async (req, res) => {
  console.log(req.body)
  Account.register(new Account({ username: req.body.username }), req.body.password, async (err, account) => {
    if (err) {
      console.log(err)
      return res.json({ account });
    }

    const user = new User({
      username: account.username,
      email: null,
      age: null,
      accountId: account.id
    });

    await user.save();

    console.log('user registered');

    res.redirect('/')

  })
})

router.get('/facebook', (req, res, next) => {
  console.log(req.query)
  req._redirectUrl = req.query.redirectUrl;
  console.log(req.query.redirectUrl)
  console.log(req._redirectUrl);
  console.log('showing request in /facebook')
  console.log(req)
  passport.authenticate(
    'facebook',
    { scope: ['email'], session: false }
  )(req, res, next);
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { user, login } = req;
  const payload = {
    username: user.username,
    exp: Date.now() + 100000
  };

  req.login(payload, { session: false }, (error) => {
    if (error) {
      res.status(400).send({ error });
    }

    const token = jwt.sign(JSON.stringify(payload), JWT_CONFIG.secret);
    res.cookie('jwt', token);
    return res.json({ token });
  })

  // res.json({ ok: '200' })

})

// router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
//   console.log(req);
//   res.json({ ok: '200' })

// })

router.post('/login-jwt', passport.authenticate('local', { session: false }), (req, res) => {
  const { user } = req;
  const payload = {
    username: user.username,
    exp: Date.now() + 100000
  };

  req.login(payload, { session: false }, (error) => {
    if (error) {
      res.status(400).send({ error });
    }

    const token = jwt.sign(JSON.stringify(payload), JWT_CONFIG.secret);
    res.cookie('jwt', token);
    return res.json({ token });
  })
})

router.get('/get-sth-jwt', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user, payload } = req;
  console.log('heool')
  res.json({ ok: 'get-sth-jwt' });
})

router.get('/facebook/callback',
  passport.authenticate('facebook',
    { failureRedirect: '/register' }
  ), (req, res) => {
    console.log('facebook/callback')
    // console.log(req);
    return res.json({ ok: '200' })
    // res.redirect()
  });

router.get('/data', passport.authenticate('jwt', { session: false }), (req, res) => {
  // const { user, payload } = req;
  // console.log('heool')
  res.json({ ok: '200' });
})
module.exports = router;
