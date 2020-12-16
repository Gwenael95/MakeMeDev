const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { rateLimiterUsingThirdParty } = require('./Tools/rateLimiter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ...Some code here

app.use(rateLimiterUsingThirdParty);
//Cors
app.use(cors({ origin: true, credentials: true }));
const router = require("./router");
router(app);

module.exports = {app}
