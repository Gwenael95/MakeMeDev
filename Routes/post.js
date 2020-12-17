/**
 * This file requires {@link module:../Controllers/postController}, {@link module:../Middlewares/middleware }  and
 * {@link module:./const}.
 * @requires module:../Controllers/postController
 * @requires module:../Middlewares/middleware
 * @requires module:./const
 */
const {sendPost, getPost, sendVote, addResponse, addCommentary, updateFunction} = require("../Controllers/postController");
const {authenticateToken, handleGetPost} = require("../Middlewares/middleware")
const {url} = require("./const");

module.exports = (app) => {
    app.get(url + "post", handleGetPost,  getPost);
    app.post(url + "post", authenticateToken,  sendPost);
    app.post(url + "post-update", authenticateToken, updateFunction);
    app.post(url + "post-add-response", authenticateToken, addResponse);
    app.post(url + "post-vote", authenticateToken, sendVote);
    app.post(url + "post-add-commentary", authenticateToken, addCommentary);
};
