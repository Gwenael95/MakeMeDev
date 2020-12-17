/**
 * This file requires {@link module:./Tools/rateLimiter} and {@link module:./router}.
 * @requires module:./Tools/rateLimiter
 * @requires module:./router
 */
const { rateLimiterUsingThirdParty } = require('./Tools/rateLimiter');
const router = require("./router");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(rateLimiterUsingThirdParty);
//Cors
app.use(cors({ origin: true, credentials: true }));
router(app);

module.exports = {app}
