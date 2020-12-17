// region Prepare to include the server code into our web_server
//region MongoDB connection
/**
 * This file requires {@link module:./Tools/DB/database},  {@link module:./app}.
 * @requires module:./Tools/DB/database
 * @requires module:./app
 */
const database = require("./Tools/DB/database")
database.connect()
//endregion

const http = require("http");
const {app} = require("./app")

const server = http.createServer(app);
require('dotenv').config();

// endregion

/**
 * Our app listen port
 * @type {number}
 */
const PORT = process.env.PORT || 4021;
server.listen(PORT, () => {
    console.log("started " + PORT);
});
