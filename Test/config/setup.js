const MemoryDatabaseServer = require('../config/MemoryDataBaseServer');

module.exports = async () => {
    await MemoryDatabaseServer.start();
};
