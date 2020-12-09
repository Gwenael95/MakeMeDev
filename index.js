// region Prepare to include the server code into our web_server
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
require('dotenv').config();
const urlMongo = process.env.URL_MONGO;

// endregion

//region mongodb connection
mongoose.connect(urlMongo, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});
//endregion

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cors
app.use(cors({ origin: true, credentials: true }));

const router = require("./router");
router(app);

const PORT = process.env.PORT || 4021;
server.listen(PORT, () => {
    console.log("started " + PORT);
});
