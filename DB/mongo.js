const UserClass = require("./User.Class");
const PostClass = require("./PostClass");

const db = {
    users: new UserClass(),
    posts: new PostClass(),
};
module.exports = db;
