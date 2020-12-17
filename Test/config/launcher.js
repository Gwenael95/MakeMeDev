/**
 * This module requires {@link module:../../app}, {@link module:../../Routes/const}.
 * @requires module:../../app
 * @requires module:../../Routes/const
 */
const supertest = require('supertest');
const {app} = require("../../app")
const request = supertest(app);
const {url} = require("../../Routes/const");

module.exports = {request, url}
