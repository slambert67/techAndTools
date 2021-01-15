const restify = require('restify');
let apiDependencies = require('./api-dependencies');
let getServiceUrl = require('get-service-url');
let serverConfig = require('./server.config');
let pkg = require('./package.json');
const MyTokenAuth = require('token-auth');
var database = require('./db-setup');
const routeHandler = require('./routeHandler');
const versioning = require('restify-url-semver');
const fs = require('fs');
const API_VERSION = serverConfig.apiVersion;
var config = require('./server.config');

let server;

let loggerOptions = {
    callingService: pkg.name,
    loglevel: config.loglevel,
    postLogsToLogService: config.postLogsToLogService,
    urlToPostTo: config.postLogsToLogService ? getServiceUrl(apiDependencies, 'log-service', `api/logs`) : null
};

let logger = require('strawman-logger')(loggerOptions);

// Methods that handle any erroneous errors
process.on('uncaughtException', function(err) {
    logger.error('Uncaught exception ', err);
    shutdown();
});

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, function (err) {
        logger.trace('Received: ' + err ? err : eventType);
        shutdown();
    });
});


let tokenAuthConfig = {
    loglevel: serverConfig.loglevel,
    publicKeyUrl: getServiceUrl(apiDependencies, 'user-service', 'publicKey'),
    serviceName: pkg.name,
    SSL: {
        enable: serverConfig.SSL.enable,
        trustedCertsInChain: serverConfig.SSL.trustedCertsInChain,
        certificateLocation: serverConfig.SSL.certificateLocation
    }
};

let tokenAuth = new MyTokenAuth(tokenAuthConfig);

if (serverConfig.SSL && serverConfig.SSL.enable) {
    let certificateLocation;

    // Use the certificate location in the config if set otherwise use CA_STORE env var
    if (serverConfig.SSL.certificateLocation) {
        certificateLocation = serverConfig.SSL.certificateLocation;
    } else if (typeof process.env.CA_STORE !== 'undefined') {
        certificateLocation = process.env.CA_STORE;
    } else {
        logger.error("SSL is enabled but certificateLocation or environment variable CA_STORE is not defined.");
        process.exit(1);
    }

    if (serverConfig.SSL.trustedCertsInChain && serverConfig.SSL.trustedCertsInChain.length > 0) {

        /*
         * Add certificate chain to ensure ultra.aero signed certificates
         * (and other self-signed certs) can be trusted when making https calls
         * this is required even if SSL not enabled for this app, but it makes
         * SSL calls to other endpoints
         */
        let rootCas = require('ssl-root-cas').create();
        serverConfig.SSL.trustedCertsInChain.forEach(function (cert) {
            if (fs.existsSync(certificateLocation + '/' + cert)) {
                rootCas
                    .addFile(certificateLocation + '/' + cert);
            } else {
                logger.error("Certificate chain file " + (certificateLocation + '/' + cert) +
                    " required but not found - exiting");
                process.exit(1);
            }
        });
        require('https').globalAgent.options.ca = rootCas;
    }

    let cert = certificateLocation + '/' + serverConfig.SSL.certificate;
    let key = certificateLocation + '/' + serverConfig.SSL.privateKey;
    let passphrase = serverConfig.SSL.passphrase;

    server = restify.createServer({
        name: pkg.name,
        certificate: fs.readFileSync(cert),
        key: fs.readFileSync(key),
        passphrase: passphrase
    });
} else {
    server = restify.createServer({
        name: pkg.name
    });
}


/* EndPonit configuration*/
server.pre(logger.middleware());
server.pre(versioning());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
restify.CORS.ALLOW_HEADERS.push('token');
server.use(restify.CORS({
    origins: ['*'],
    // defaults to false
    credentials: false,
    // sets expose-headers
    headers: ['']
}));

// add token validation middleware
server.use(function (req, res, next) {
    if (config.tokenConfig && config.tokenConfig.enableTokenValidation) {
        return tokenAuth.verifyToken(req, res, next);
    }
    else {
        next();
    }
});

server.get({path: '/healthcheck', version: API_VERSION}, routeHandler.healthcheck);

server.get({path: '/underlyingApisHealthcheck', version: API_VERSION}, routeHandler.underlyingApisHealthcheck);

server.get({
    path: '/resilientUnderlyingApisHealthcheck',
    version: API_VERSION
}, routeHandler.resilientUnderlyingApisHealthcheck);


/* End point for getting data for a specific page*/
server.get({path: '/api/aims/pageDataByKey?keyPage=:keyPage&siteId=:siteId',  version: API_VERSION},
  routeHandler.getPageDataByKey);

/*End point for getting template for a specific page*/
server.get({path: '/api/aims/pageTemplateByKey?keyPage=:keyPage&siteId=:siteId',  version: API_VERSION},
  routeHandler.getPageTemplateByKey);

/* End point for getting page to display on a specific device*/
server.get({path: '/api/aims/currentPageForDevice?ipAddress=:ipAddress&siteId=:siteId',  version: API_VERSION},
  routeHandler.getCurrentPageForDevice);

server.get({path: '/ip', version: API_VERSION},function (req, res) {
    let ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if (ip.includes('.')) {
        // This is a v4 address in a v6 format so extract the ip address
        // otherwise send out the v6 address as is
        ip = ip.substring(ip.lastIndexOf(':')+1);
    }
    res.send(ip);
});

function logError(userMessage, errObject){
    if (errObject && errObject.message){
        logger.error(`${userMessage} - ${errObject.message}`);
    } else  {
        logger.error(userMessage);
    }
}

// Shuts down oracledb connection pool
function shutdown() {
    logger.trace('Shutting down');
    logger.trace('Closing web server');

    database.terminatePool()
      .then(function() {
          logger.trace('node-oracledb connection pool terminated');
          logger.trace('Exiting process');
          process.exit(0);
      })
      .catch(function(err) {
          logError('Error removing CQN subscriptions', err);
          logger.trace('Exiting process');
          process.exit(1);
      });
}

/* Initialise OracleDb Connection Pool and once initialised start listening for connections*/
function init() {
    return new Promise ( (resolve, reject) =>   {
        if(serverConfig.dbConnectionSettings.useConnectionPooling) {
            database.createPool()
              .then(function() {
                  logger.trace('Oracle connection pool was successfully created');
                  resolve();
              })
              .catch(function(err) {
                  logError('Error occurred creating database connection pool', err);
                  logger.trace('Exiting process');
                  reject();
              });
        } else {
            logger.trace('Connection pooling is disabled in the config. Connections to the database will be created per request.');
            resolve();
        }
    });
}

// Call to init - if worked OK then start page conversion
init()
  .then(() => {
      server.listen(serverConfig.appPort, function () {
          logger.info({
              server: {
                  name: server.name,
                  url: server.url
              }
          }, 'server started');
      });
  })
  .catch(err => {
      shutdown();
  });


module.exports = server;
