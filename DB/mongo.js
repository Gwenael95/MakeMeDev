const UserClass = require("./UserClass");
const PostClass = require("./PostClass");

const db = {
    users: new UserClass(),
    posts: new PostClass(),
};
module.exports = db;
