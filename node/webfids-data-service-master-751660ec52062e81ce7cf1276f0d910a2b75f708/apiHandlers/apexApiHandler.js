let request = require('request');

let getServiceUrl = require('get-service-url');
let apiDependencies = require('../api-dependencies');

let serverConfig = require('../server.config');

let pkg = require('../package.json');

let getLoggerOptions = () => {
  return {
    callingService: pkg.name,
    loglevel: serverConfig.loglevel,
    postLogsToLogService: serverConfig.postLogsToLogService,
    urlToPostTo: serverConfig.postLogsToLogService ? getServiceUrl(apiDependencies, 'log-service', `api/logs`) : null
  };
};

let logger = require('strawman-logger')(getLoggerOptions());

let healthcheck = function (req) {
    let options = {
        url: getServiceUrl(apiDependencies, `apex-data-api`, `healthcheck`),
        method: 'GET',
        headers: {
            'user': JSON.stringify(req.user),
            'x-request-id': req.requestId
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (err) {
            if (err) {
                logger.error({error: err.message}, 'failed to get data from APEX API');
                let error = {'system': 'APEX', 'message': err.message};
                reject(error);
            } else {
                let data = {'system': 'APEX', 'message': 'OK'};
                resolve(data);
            }
        });
    });
};

module.exports = {
    'healthcheck': healthcheck
};
