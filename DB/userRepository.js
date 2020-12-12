const uniqueValidator = require('mongoose-unique-validator')
const {userSchema} = require("../Models/userModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {generate, verify} = require("password-hash");
const UserModel = mongoose.model('users', userSchema)

/** @function
 * @name signUp
 * Add a new user in database, and return the result of this try
 * @param {object} userData - user to add, should correspond to userModel {@link '../Models/userModels'}.
 * @returns {Promise<{success: *}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
async function signUp(userData) {
    userSchema.plugin(uniqueValidator)
    const doc = new UserModel(userData);
    doc.password = generate(userData.password)
    return await doc.save()
        .then(result => {return {success: filterPassword(result)}})
        .catch(err => {return {error: err.errors}})
}

/** @function
 * @name signIn
 * Check if user's data are in database and right, depending on a many fields, and return the result of this try
 * @param {object} userData - data to search in database
 * @returns {Promise<{success: *}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
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


/** @function
 * @name filterPassword
 * Delete user password, to avoid security issues
 * @param {object} data - an object from where to delete one field : password
 * @returns {object}
 */
function filterPassword(data) {
    data["password"] = ":)"
    delete data.password
    return data
}

async function updateUserById(data) {
    userSchema.plugin(uniqueValidator)
    return await UserModel
        .findOneAndUpdate(
            { _id: ObjectId(data.id)},
            setUpdateValue(data),
            {new: true, runValidators: true, context: "query"} )
        .lean()
        .exec()
        .then((result) => {
            return {success: filterPassword(result)}
        })
        .catch(err => {
            return {error: err.errors}
        })
}

function setUpdateValue(data) {
    let updateValue = {}
    if (data.pseudo) {
        updateValue["pseudo"] = data.pseudo
    }
    if (data.mail) {
        updateValue["mail"] = data.mail
    }
    if (data.avatar) {
        updateValue["avatar"] = data.avatar
    }
    return {$set: updateValue}
}

module.exports = {signUp, signIn, updateUserById};
