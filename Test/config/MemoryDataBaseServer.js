const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * @class MemoryDatabaseServer
 */
class MemoryDatabaseServer {
  constructor() {
    this.mongod = new MongoMemoryServer({
      binary: {
        version: '4.0.3',
      },
      autoStart: false,
    });
  }

  /**
   * @method start
   * Start mongodb
   * @returns {Promise<boolean>}
   */
  start() {
    return this.mongod.start();
  }

  /**
   * @method stop
   * Stop mongodb
   * @returns {Promise<boolean>}
   */
  stop() {
    return this.mongod.stop();
  }

  /**
   * @method getConnectionString
   * Get mongodb URI
   * @returns {Promise<string>}
   */
  getConnectionString() {
    return this.mongod.getUri();
  }
}

module.exports = new MemoryDatabaseServer();
