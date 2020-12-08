const {sendPost} = require("../Controlleurs/postController");
const {url} = require("./const");

module.exports = (app) => {
    console.log(url + "post")
    app.post(url + "post", sendPost);
};
