/**
 * This module requires {@link module:../../Tools/DB/database}.
 * @requires module:../../Tools/DB/database
 */
const databaseHelper = require('../../Src/Tools/DB/database');
require('dotenv').config();


beforeAll(() => {
    return databaseHelper.connect();
});

beforeEach(() => {
    return databaseHelper.truncate();
});

afterAll(() => {
    return databaseHelper.disconnect();
});
