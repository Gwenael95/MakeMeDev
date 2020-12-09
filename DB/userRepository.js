const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const {userSchema} = require("../Models/userModel");

async function signUp(data) {
    userSchema.plugin(uniqueValidator)
    const UserModel = mongoose.model('users', userSchema);
    const doc = new UserModel(data);
    return await doc.save().then(result => {return {success: result}}).catch(err => {return {error: err.errors}})
}

async function signIn(userData) {
    const UserModel = mongoose.model('users', userSchema);
// select only the adventures name and length

    //await doc.save().then(result => {return {success: result}}).catch(err => {return {error: err.errors}})
    return await UserModel.findOne({  $or: [
            { pseudo: userData.login  },
            { mail: userData.login },
        ],  password: userData.password }, { '_id': 0, "password":0} )
        .exec()
        .then(result => {return {success: result}})
        .catch(err => {return {error: err.errors}});
}

module.exports = {signUp, signIn};
