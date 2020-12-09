const uniqueValidator = require('mongoose-unique-validator')
const {userSchema} = require("../Models/userModel");
const mongoose = require('mongoose');
const {generate, verify} = require("password-hash");
const UserModel = mongoose.model('users', userSchema)

async function signUp(data) {
    userSchema.plugin(uniqueValidator)
    const doc = new UserModel(data);
    doc.password = generate(data.password)
    return await doc.save().then(result => {return {success: result}}).catch(err => {return {error: err.errors}})
}

async function signIn(userData) {
    return await UserModel.findOne({  $or: [
            { pseudo: userData.login  },
            { mail: userData.login },
        ]}, { '_id': 0, "__v": 0} )
        .exec()
        .then(result => {
            return verify(userData.password, result.password) ? {success: filterPassword(result)} : {error: "mot de passe incorrect"}
        })
        .catch(err => {return {error: err.errors}});
}

function filterPassword(user) {
    user["password"] = ":)"
    return user
}

module.exports = {signUp, signIn};
