// Prepare to include the server code into our web_server
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
/* End setup webserver */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cors
app.use(cors({ origin: true, credentials: true }));

const router = require("./router");
router(app);

const PORT = 4021;
server.listen(PORT, () => {
    console.log("started " + PORT);
});
