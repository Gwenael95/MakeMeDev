const {sendPost, getPost, sendVote, addResponse, addCommentary} = require("../Controllers/postController");
const {url} = require("./const");
const {authenticateToken} = require("../Middlewares/middleware")

module.exports = (app) => {
    app.get(url + "post",  getPost);
    app.post(url + "post", authenticateToken, sendPost);
    app.post(url + "post-add-response", authenticateToken, addResponse);
    app.post(url + "post-vote", authenticateToken, sendVote);
    app.post(url + "post-add-commentary", authenticateToken, addCommentary);
};
