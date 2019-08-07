import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    accountId: String,
    email: String,
    age: Number,
    facebookId: String,
    googleId: String
})

export default mongoose.model('User', User);