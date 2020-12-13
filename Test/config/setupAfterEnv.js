require('dotenv').config();

const databaseHelper = require('../../Tools/DB/database');

beforeAll(() => {
    return databaseHelper.connect();
});

beforeEach(() => {
    return databaseHelper.truncate();
});

afterAll(() => {
    return databaseHelper.disconnect();
});
