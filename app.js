const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cors
app.use(cors({ origin: true, credentials: true }));
const router = require("./router");
router(app);

module.exports = {app}
