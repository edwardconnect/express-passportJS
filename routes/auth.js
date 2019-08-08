import express from 'express';

import User from '../models/account'
import Account from '../models/account';
import jwt from 'jsonwebtoken';
import JWT_CONFIG from '../configs/jwt';
import passport from 'passport'

const router = express.Router();

router.get('/facebook', (req, res, next) => {
  req._redirectUrl = req.query.redirectUrl;
  passport.authenticate(
    'facebook', { scope: ['email'], session: false, state: req.query.redirectUrl }
  )(req, res, next);
});


router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/register' }),
  (req, res) => {
    console.log(req)
    console.log('callback to ')
    console.log(req.user.token)
    res.cookie('jwt', req.user.token);
    // return res.json({ok:req.token})
    res.redirect(req.user.redirectUrl);
  })

router.get('/logout', (req, res) => {
  res.cookie('jwt', undefined);
  res.status(200).send();
})

export default router;