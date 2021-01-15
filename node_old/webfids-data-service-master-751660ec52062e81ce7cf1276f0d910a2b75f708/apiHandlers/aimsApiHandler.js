let request = require('request');
let getServiceUrl = require('get-service-url');
let apiDependencies = require('../api-dependencies');
let serverConfig = require('../server.config');
let pkg = require('../package.json');
var {executeOracleFunction, executeOracleSelect, executeOracleUpdate} = require('../executeCommands');
var statements = require('../statements');
var oracledb = require('oracledb');

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
        url: getServiceUrl(apiDependencies, `aims-data-api`, `healthcheck`),
        method: 'GET',
        headers: {
            'user': JSON.stringify(req.user),
            'x-request-id': req.requestId
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (err) {
            if (err) {
                logger.error({error: err.message}, 'failed to get data from AIMS API');
                let error = {'system': 'AIMS', 'message': err.message};
                reject(error);
            } else {
                let data = {'system': 'AIMS', 'message': 'OK'};
                resolve(data);
            }
        });
    });
};


async function getPageDataByKey(req) {
  /* This function accepts a pageKey (a page identifier) and returns
      the data associated with that page. */

  // Parameter validation
  if (typeof(req.params.keyPage) === 'undefined' || typeof(req.params.siteId) === 'undefined') {
      const errorMessage = `Required parameters keyPage and siteId not supplied`;
      req.logger.error(errorMessage);
      // send back status code 400 = bad request
      const error = {
        'system': serverConfig.system,
        'statusCode': 400,
        'message': errorMessage
      };
      throw(error);
  }

  let keyPage = Number(req.params.keyPage);
  let siteId = req.params.siteId;
  let pageData;

  try {

    let params = { resultset: {type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                   keyPage:   {type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: keyPage},
                   siteId :   {type: oracledb.STRING, dir: oracledb.BIND_IN, val: siteId}
                  };

    // Execute function to get the pages data
    pageData = await executeOracleFunction(statements.getPageData, params, { autoCommit: true });

    if (pageData[0] != null ){
        return pageData.map(el => JSON.parse(el));
    } else {
      /*No data found (which is not an error) so return nothing*/
      return null;
    }
  }
  catch (err) {
    const error = {
      'system': serverConfig.system,
      'statusCode': 400,
      'message': 'Error fetching page data for page:' + keyPage + '-' + err.message
    };
    throw(error);
  }

}

async function getPageTemplateByKey(req) {

  // Parameter validation
  if (typeof(req.params.keyPage) === 'undefined' || typeof(req.params.siteId) === 'undefined') {
    const errorMessage = `Required parameters keyPage and siteId not supplied`;
    req.logger.error(errorMessage);
    // send back status code 400 = bad request
    const error = {
      'system': serverConfig.system,
      'statusCode': 400,
      'message': errorMessage
    };
    throw(error);
  }

  let keyPage = req.params.keyPage;
  let siteId = req.params.siteId;

  try {
    return await executeOracleSelect(statements.pageTemplateSelectStmt, [keyPage, siteId], {});
  }
  catch (err) {
    const error = {
      'system': serverConfig.system,
      'statusCode': 400,
      'message': 'Error fetching page select stmt for page:' + keyPage + '-' + err.message
    };
    throw(error);
  }
}

async function getCurrentPageForDevice(req) {

  // Parameter validation
  if (typeof(req.params.ipAddress) === 'undefined' || typeof(req.params.siteId) === 'undefined') {

    // send back status code 400 = bad request
    throw(handleError(`Required parameters ipAddress and siteId not supplied`));
  }

  let ipAddress = req.params.ipAddress;
  let siteId = req.params.siteId;

  try {
    return await executeOracleSelect(statements.currentPageSelectStmt, [ipAddress, ipAddress, siteId], {});
  }
  catch (err) {
    const error = {
      'system': serverConfig.system,
      'statusCode': 400,
      'message': 'Error fetching pages to display for ipAddress:' + ipAddress + '-' + err.message
    };
    throw(error);
  }
}

function handleError(errorMessage) {
  return {
    'system': serverConfig.system,
    'statusCode': 400,
    'message': errorMessage
  };
}

module.exports = {
    'healthcheck': healthcheck,
    'getPageDataByKey' : getPageDataByKey,
    'getPageTemplateByKey' : getPageTemplateByKey,
    'getCurrentPageForDevice' : getCurrentPageForDevice
};
