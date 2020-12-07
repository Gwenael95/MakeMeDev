const UserClass = require("./User.Class");
const FunctionClass = require("./Function.Class");

const db = {
    users: new UserClass(),
    functions: new FunctionClass(),
};
module.exports = db;
