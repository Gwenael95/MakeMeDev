const mongoose = require('mongoose');
require('dotenv').config();


function connect() {
    if (mongoose.connection.readyState === 0) {
        process.env.NODE_ENV === 'test' ? configTest() : configMongo()
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
        db.once('open', function (){
            console.log("Connexion à la base OK");
        });
    }
}

const configTest = () => {
    mongoose.connect(global.__DB_URL__,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
}

const configMongo = () => {
    mongoose.connect(process.env.URL_MONGO,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })}

function truncate()  {
    if (mongoose.connection.readyState !== 0) {
        const { collections } = mongoose.connection;

        const promises = Object.keys(collections).map(collection =>
            mongoose.connection.collection(collection).deleteMany({})
        );

         Promise.all(promises);
    }
}

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
