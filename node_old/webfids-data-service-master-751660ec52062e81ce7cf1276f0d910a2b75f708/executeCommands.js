let getServiceUrl = require('get-service-url');
let apiDependencies = require('./api-dependencies');
let serverConfig = require('./server.config');
let dbSetup = require('./db-setup');
let pkg = require('./package.json');
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



let executeOracleFunction = async function (statement, params, options) {

    // Function to accept and execute an Oracle function that returns a resultset
    let connection;

    try {
        connection = await dbSetup.getDBConnection();
        // For function calls we want the output type to be an array
        let resultSet = await connection.execute(statement, params, {outFormat: oracledb.ARRAY});
        //Get to the data within the resultset object
        var rs = resultSet.outBinds.resultset;

        // Overall resultset to be returned
        let resultsArray = [];
        // Placeholder for each array returned by the call to getRows
        let getRowsArray;

        try {
          if (rs) {
            //Number of rows to fetch per loop
            const numRows = 20;
            do {
              // Loop through db refcursor resultset and extract the result into an array
              getRowsArray = await rs.getRows(numRows);
              //Concatenate the resultset from each call to getRows into one master resultset
              resultsArray = resultsArray.concat(getRowsArray);
              //Exit loop when no more data to be extracted from the resultset
            } while (getRowsArray.length);

            // Return final data set
            return resultsArray;

           } else {
            // No data to return. This is not an error
            return null;
          }
        }
        finally {
          // Close the resultset
          if (rs) {
            await rs.close();
          }
        }

    } catch (err) {
        let errMsg = 'Connection or Execution error: ' + err;
        logger.error(errMsg);
        throw new Error(errMsg);
    } finally {
         if (connection) {
           await dbSetup.doRelease(connection);
         }
    }
};

let executeOracleSelect = async function (statement, params, options) {
  // Function to accept and execute a Select stmt
  let connection;

  try {
    connection = await dbSetup.getDBConnection();
    let results = await connection.execute(statement, params, options);
    let resultsArray = [];

    if (results.metaData.length === 1) {
      // If the resultset contains only one column it could be the result of a simple select stmt
      // in which case the result is a Javascript object (by default) or it could be the
      // pageTemplate in which case the resultset is already in JSON format. These 2 possibilities
      // need to be handled separately. If it is in JSON format then it needs parsing into a Javascript
      //  object. If already a Javascript object then do nothing.

      // Copy the value of this column onto a new array
      results.rows.forEach(row => {
        resultsArray.push(row[results.metaData[0].name]);
      });

      try {
        // Try to parse it. If it parses it was already in JSON format,
        // if not it is a Java script object
        resultsArray = [JSON.parse(resultsArray)];

      } catch (err) {
        // resultsArray is already a Javascript object so do nothing and send
        // the resultset out as is
      }
    } else  {
      // The resultset contains multiple columns so send out it out as an array
      resultsArray = results.rows;
    }

    return resultsArray;

  } catch (err) {
    let errMsg = 'Connection or Execution error: ' + err;
    logger.error(errMsg);
    throw new Error(errMsg);
  } finally {
    if (connection) {
      await dbSetup.doRelease(connection);
    }
  }
};


module.exports = {
    'executeOracleFunction': executeOracleFunction,
    'executeOracleSelect': executeOracleSelect
};
