const mongoose = require('mongoose');
const {userSchema} = require("../Models/userModel");

/*
user model
"users":
    {
        '_id': "",
        "userName": "",
        "mail": "",
        "pseudo": "",
        "password": "",
        "avatar": "",
        "creationDate": "",
        "activties": {
            "like": [],
            "dislike": [],
            "commentary": [
                {
                    "post_id": "",
                    "commentary": "",
                    "creationDate": ""
                }
            ],
        },
        "post": [],
        "bookMark": []
    }
* */


async function signUp(data) {
    const UserModel = mongoose.model('users', userSchema);
    const doc = new UserModel(data);
    await doc.save(
        (err) => {
            if (err) {
                console.log(err)
            }
        });
    return !doc.getChanges().$set;
}


module.exports = {signUp};
