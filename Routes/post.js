const {sendPost, getPost, sendVote, addResponse, addCommentary, updateFunction} = require("../Controllers/postController");
const {url} = require("./const");
const {authenticateToken, checkIfIdOrName} = require("../Middlewares/middleware")

module.exports = (app) => {
    app.get(url + "post", checkIfIdOrName,  getPost);
    app.post(url + "post", authenticateToken,  sendPost);
    app.post(url + "post-update", authenticateToken, updateFunction);
    app.post(url + "post-add-response", authenticateToken, addResponse);
    app.post(url + "post-vote", authenticateToken, sendVote);
    app.post(url + "post-add-commentary", authenticateToken, addCommentary);
};
