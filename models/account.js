import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    facebookId: String,
    googleId: String,
    activate: Boolean
})

Account.plugin(passportLocalMongoose);

export default mongoose.model('Account', Account);