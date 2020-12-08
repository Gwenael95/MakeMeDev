const {sendPost, getPost} = require("../Controllers/postController");
const {url} = require("./const");

module.exports = (app) => {
    app.get(url + "post", getPost);
    app.post(url + "post", sendPost);
};
