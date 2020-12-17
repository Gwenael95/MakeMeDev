/**
 * This module requires {@link module:../config/MemoryDataBaseServer}.
 * @requires module:../config/MemoryDataBaseServer
 */
const MemoryDatabaseServer = require('../config/MemoryDataBaseServer');
const NodeEnvironment = require('jest-environment-node');

/**
 * @class CustomEnvironment
 * @extends {NodeEnvironment}
 */
class CustomEnvironment extends NodeEnvironment {

    /**
     * @method setup
     * @returns {Promise<void>}
     */
    async setup() {
        await super.setup();

        this.global.__DB_URL__ = await MemoryDatabaseServer.getConnectionString();
    }

     /**
     * @method teardown
     * @returns {Promise<void>}
     */
    async teardown() {
        await super.teardown();
    }

    /**
     * @method start
     * @param script
     * @returns {unknown}
     */
    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = CustomEnvironment;
