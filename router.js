module.exports = (app) => {
  require("./Src/Routes/user")(app);
  require("./Src/Routes/post")(app);
};
