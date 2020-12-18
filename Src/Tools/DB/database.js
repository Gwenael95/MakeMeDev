/**
 * @namespace Tools
 */
const mongoose = require('mongoose');
require('dotenv').config();


/**
 * connect
 * @function
 * @memberOf Tools
 * @name connect -
 * Connect to DB for test or production
 */
function connect() {
    if (mongoose.connection.readyState === 0) {
        mongoose.connect((process.env.NODE_ENV === 'test' ? global.__DB_URL__ :process.env.URL_MONGO),
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
        db.once('open', function (){
            console.log("Connexion à la base OK");
        });
    }
}

/**
 * truncate
 * @function
 * @memberOf Tools
 * @name truncate -
 */
function truncate()  {
    if (mongoose.connection.readyState !== 0) {
        const { collections } = mongoose.connection;

        const promises = Object.keys(collections).map(collection =>
            mongoose.connection.collection(collection).deleteMany({})
        );

         Promise.all(promises);
    }
}

/**
 * disconnect
 * @function
 * @memberOf Tools
 * @name disconnect -
 */
function disconnect() {
    if (mongoose.connection.readyState !== 0) {
        mongoose.disconnect();
    }
}

module.exports = {
    connect,
    truncate,
    disconnect,
};
