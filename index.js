// Prepare to include the server code into our web_server
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const urlmongo = "mongodb://ujrosah0spdjrzvsreq3:wHmS3T4pjF0gcYJIYGA7@bv9h1dk3wxrjako-mongodb.services.clever-cloud.com:27017/bv9h1dk3wxrjako";
/* End setup webserver */

mongoose.connect(urlmongo, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

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
