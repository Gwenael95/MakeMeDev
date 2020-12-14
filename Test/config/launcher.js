const supertest = require('supertest');
const {app} = require("../../app")

const request = supertest(app);
const {url} = require("../../Routes/const");

module.exports = {request, url}
