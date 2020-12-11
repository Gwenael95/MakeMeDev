const uniqueValidator = require('mongoose-unique-validator')
const {userSchema} = require("../Models/userModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {generate, verify} = require("password-hash");
const UserModel = mongoose.model('users', userSchema)

async function signUp(data) {
    userSchema.plugin(uniqueValidator)
    const doc = new UserModel(data);
    doc.password = generate(data.password)
    return await doc.save()
        .then(result => {return {success: filterPassword(result)}})
        .catch(err => {return {error: err.errors}})
}

async function signIn(userData) {
    return await UserModel.findOne({  $or: [
            { pseudo: userData.login  },
            { mail: userData.login },
        ]}, { "__v": 0} ).lean()
        .exec()
        .then(result => {
            return result===null ? {error: "login incorrect"}
            : verify(userData.password, result.password) ? {success: filterPassword(result)}
            : {error: "mot de passe incorrect"}
        })
        .catch(err => {return {error: err.errors}});
}

function filterPassword(user) {
    //user["password"] = ":)"
    delete user.password
    return user
}

async function updateUserById(data) {
    await UserModel.updateOne({ _id: ObjectId(data.id) }, setUpdateValue(data))

    // return await doc.save()
    //     .then(result => {return {success: filterPassword(result)}})
    //     .catch(err => {return {error: err.errors}})
}

function setUpdateValue(data) {
    let pseudo = {}
    let mail = {}
    let avatar = {}
    if (data.pseudo) {
        pseudo = {pseudo: data.pseudo}
    }
    if (data.mail) {
        mail = {mail: data.mail}
    }
    if (data.avatar) {
        avatar = {avatar: data.avatar}
    }
    console.log({ $set: pseudo, mail, avatar })
    return { $set: pseudo, mail, avatar }
}
module.exports = {signUp, signIn, updateUserById};
