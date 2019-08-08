import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import jwt from 'jsonwebtoken';
import JWT_CONFIG from '../configs/jwt';

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    facebookId: String,
    googleId: String,
    activate: Boolean
})

Account.methods.generateToken = function() {
    const payload = {
        username: this.username,
        exp: Date.now() + 100000
    }

    return jwt.sign(JSON.stringify(payload), JWT_CONFIG.secret);
}

Account.plugin(passportLocalMongoose);

export default mongoose.model('Account', Account);