// region Prepare to include the server code into our web_server
//region MongoDB connection
const database = require("./Tools/DB/database")
database.connect()
//endregion

const http = require("http");
const {app} = require("./app")

const server = http.createServer(app);
require('dotenv').config();

// endregion


const PORT = process.env.PORT || 4021;
server.listen(PORT, () => {
    console.log("started " + PORT);
});
