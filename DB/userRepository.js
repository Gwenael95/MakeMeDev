const uniqueValidator = require('mongoose-unique-validator')
const {userSchema} = require("../Models/userModel");
const {UserModel} = require("../Models/models");

async function signUp(data) {
    userSchema.plugin(uniqueValidator)
    const doc = new UserModel(data);
    return await doc.save().then(result => {return {success: result}}).catch(err => {return {error: err.errors}})
}

async function signIn(userData) {
    return await UserModel.findOne({  $or: [
            { pseudo: userData.login  },
            { mail: userData.login },
        ],  password: userData.password }, { '_id': 0, "password":0} )
        .exec()
        .then(result => {return {success: result}})
        .catch(err => {return {error: err.errors}});
}

module.exports = {signUp, signIn};
