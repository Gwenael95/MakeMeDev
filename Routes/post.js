const {sendPost, getPost, sendVote} = require("../Controllers/postController");
const {url} = require("./const");
const {authenticateToken} = require("../Middlewares/middleware")

module.exports = (app) => {
    app.get(url + "post",  getPost);
    app.post(url + "post", authenticateToken, sendPost);
    app.post(url + "post-vote", authenticateToken, sendVote);
};
