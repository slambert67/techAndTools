const db = require('mongoose');

let mongoUrl;

async function connect(
    { mongo: { url } = {} } ={} ) {
    // parameter is using object destructuring and suppling default values of {}

    mongoUrl = url;

    try {

    } catch (err) {
        setTimeout(connect,8000);
    }
}


const dbConnection = db.connection;


function disconnect() {
    dbConnection.removeAllListeners();
    return db.disconnect();
}


module.exports = {
    connect,
    disconnect
}

