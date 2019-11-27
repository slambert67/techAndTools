let oracledb = require('oracledb');
let config   = require('./server.config');
var crypto = require('crypto');
let pool;

let getDbConfig = () => {
    return {
        connectString: config.dbConnectionSettings.connectString,
        initSession: config.dbConnectionSettings.initSession,
        user: config.dbConnectionSettings.user,
        password:  config.dbConnectionSettings.password
        };
    };

oracledb.outFormat = oracledb.OBJECT;
oracledb.maxRows = 0;

const pwd = 'ULT34L415UDE';

let encryptWithCypher = function(stringToEncrypt, algorithm, password){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(stringToEncrypt,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

let decryptWithCypher = function(stringToDecrypt, algorithm, password){
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(stringToDecrypt,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

let encrypt = function (text){
    return encryptWithCypher(text, 'aes-256-cbc', pwd);
};

let decrypt = function(text){
    return decryptWithCypher(text, 'aes-256-cbc',pwd);
};

let initSession = function(connection, requestedTag, cb) {
    connection.execute(config.dbConnectionSettings.clientTimeZone,  cb);
};

function createPool() {
    return new Promise(function(resolve, reject) {
        oracledb.createPool({
            connectString:    getDbConfig().connectString,
            user:             decrypt(getDbConfig().user),
            password:         decrypt(getDbConfig().password),
            poolMax:          20,
            poolMin:          20,
            poolIncrement:    0,
            homogeneous:      true,
            sessionCallback : initSession
        },
            function(err, p) {
                if (err) {
                    return reject(err);
                }
                pool = p;
                resolve();
            }
        );
    });
}

function terminatePool() {
    return new Promise(function(resolve, reject) {
        if (pool) {
            pool.terminate(10, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function getPool() {
    return pool;
}

function getDb() {
    if (pool) {
        return getPool();
    } else {
        return oracledb;
    }
}

async function doRelease(connection) {
    await connection.close(
      function(err) {
          if (err) {
              logger.error(err, 'connection release failed');
          }
      });
}

async function getDBConnection () {
    let connection;
    let database = getDb();

    try {
        if (getPool()) {
            // Get a pooled connection
            connection = await database.getConnection();
        } else {
            // Get a standard non-pooled connection
            connection = await database.getConnection({
                connectString: getDbConfig().connectString,
                user: decrypt(getDbConfig().user),
                password: decrypt(getDbConfig().password)
            });
            await connection.execute(config.dbConnectionSettings.clientTimeZone);
        }
        return (connection);
    } catch (err) {
        let errMsg = 'Connection error: ' + err.message;
        throw new Error(errMsg);
    }
}

module.exports = {
    'getDb': getDb,
    'getPool': getPool,
    'terminatePool': terminatePool,
    'createPool': createPool,
    'getDbConfig': getDbConfig,
    'decrypt': decrypt,
    'getDBConnection': getDBConnection,
    'doRelease': doRelease,
    'initSession': initSession
};


