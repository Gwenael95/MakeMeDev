module.exports = (app) => {
  require("./Routes/user")(app);
  require("./Routes/post")(app);
};
