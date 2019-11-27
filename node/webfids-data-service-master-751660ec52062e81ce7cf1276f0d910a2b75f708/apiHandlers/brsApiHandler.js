let request = require('request');

let config = require('../server.config');

let getServiceUrl = require('get-service-url');
let apiDependencies = require('../api-dependencies');

let pkg = require('../package.json');

let getLoggerOptions = () => {
  return {
    callingService: pkg.name,
    loglevel: config.loglevel,
    postLogsToLogService: config.postLogsToLogService,
    urlToPostTo: config.postLogsToLogService ? getServiceUrl(apiDependencies, 'log-service', `api/logs`) : null
  };
};

let logger = require('strawman-logger')(getLoggerOptions());


const healthcheck = function (req) {
    const options = {
        url: getServiceUrl(apiDependencies, `brs-data-api`, `healthcheck`),
        method: 'GET',
        headers: {
            'user': JSON.stringify(req.user),
            'x-request-id': req.requestId
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (err) {
            if (err) {
                logger.error({error: err.message}, 'failed to get data from BRS API');
                const error = {'system': config.system, 'message': err.message};
                reject(error);
            } else {
                const data = {'system': config.system, 'message': 'OK'};
                resolve(data);
            }
        });
    });
};


module.exports = {
  'healthcheck': healthcheck
};
