/**
 * This module requires {@link module:../config/MemoryDataBaseServer}.
 * @requires module:../config/MemoryDataBaseServer
 */
const MemoryDatabaseServer = require('../config/MemoryDataBaseServer');

module.exports = async () => {
    await MemoryDatabaseServer.start();
};
