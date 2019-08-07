import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwtConfig from '../configs/jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import Account from '../models/account';
import user from '../models/user';

/**
 * Local Strategy
 */
const localStrategy = new LocalStrategy((username, password, done) => {
  Account.findOne({ username: username }, async (err, user) => {
    try {
      console.log('ok ah')
      if (err) { throw new Error(err) }
      if (!user) { throw new Error('User not found') }
      // if (!user.activate) { throw new Error('User is not activated') }
      await user.authenticate(password);
    } catch (e) {
      console.log(e)
      return done(null, false);
    }

    return done(null, user);
  })
})

/**
 * JWT Stragtegy
 */
const jwtStrategy = new JwtStrategy({
  secretOrKey: jwtConfig.secret,
  jwtFromRequest: req => req.cookies.jwt
}, (payload, done) => {
  console.log('Payload received', payload);
  return done(null, payload);

})


/**
 * Facebook strategy constants
 */
const FACEBOOK_APP_ID = '2887329711339792';
const FACEBOOK_APP_SECRET = 'eda78b7ca7c527c11bd7f8487fa949c0';
const FACEBOOK_CB_URL = 'http://localhost:3000/facebook/callback';

/**
 * Facebook strategy
 */
const facebookStrategy = new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: FACEBOOK_CB_URL,
  profileFields: ['id', 'email', 'name']
}, async (accesstoken, refreshToken, profile, cb) => {
  console.log('profile')
  console.log(profile)
  let account;
  try {
    account = await Account.findOne({ username: profile.emails[0].value }).exec();
    console.log(account)
    console.log('account fetched')
    if (account === undefined || account === null) {
      console.log('new account is pending to create')
      const newAccount = new Account({
        username: profile.emails[0].value,
        activate: false,
        facebookId: profile.id
      })
      console.log('account is created')
      account = await newAccount.save();
      console.log('account is saved')
    }

  } catch (e) {
    console.log(e.message);
    return cb(null, false);
  }
  console.log('before return')
  return cb(null, account);
})

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);
passport.use('facebook', facebookStrategy);
