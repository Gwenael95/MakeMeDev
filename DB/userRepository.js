const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const {userSchema} = require("../Models/userModel");

async function signUp(data) {
    userSchema.plugin(uniqueValidator)
    const UserModel = mongoose.model('users', userSchema);
    const doc = new UserModel(data);
    return await doc.save().then(result => {return {success: result}}).catch(err => {return {error: err.errors}})
}

module.exports = {signUp};
