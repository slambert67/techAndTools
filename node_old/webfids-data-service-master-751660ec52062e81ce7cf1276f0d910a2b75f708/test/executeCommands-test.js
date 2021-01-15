var test = require('tape');
let rewire = require('rewire');
let sinon = require('sinon');
let sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

test('getLoggerOptions should call getServiceUrl when postLogsToLogService is true', function(t) {

    //Arrange
  let pkg = {};
  let stubUrl = 'stub url';
  let getServiceUrl = sinon.stub().returns(stubUrl);
  let executeCommand = rewire('../executeCommands');
  let expectedResult = {
    callingService: 'stub name',
    loglevel: 'stub log level',
    postLogsToLogService: true,
    urlToPostTo: stubUrl
  };

  pkg.name = 'stub name';
  const serverConfig = {
    loglevel: 'stub log level',
    postLogsToLogService: true
  };

  executeCommand.__set__({
    'pkg': pkg,
    'serverConfig': serverConfig,
    'getServiceUrl': getServiceUrl
  });

    //Act
  let returnedOptions = executeCommand.__get__('getLoggerOptions')();

    //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, true, 'getServiceUrl has been called');
  t.end();

});

test('getLoggerOptions should not call getServiceUrl when postLogsToLogService is false', function(t) {

    //Arrange
  let pkg = {};
  let getServiceUrl = sinon.stub();
  let executeCommand = rewire('../executeCommands');
  let expectedResult = {
    callingService: 'stub name',
    loglevel: 'stub log level',
    postLogsToLogService: false,
    urlToPostTo: null
  };

  pkg.name = 'stub name';
  const serverConfig = {
    loglevel: 'stub log level',
    postLogsToLogService: false
  };

  executeCommand.__set__({
    'pkg': pkg,
    'serverConfig': serverConfig,
    'getServiceUrl': getServiceUrl
  });

    //Act
  let returnedOptions = executeCommand.__get__('getLoggerOptions')();

    //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, false, 'getServiceUrl has been called');
  t.end();

});

test('executeOracleFunction should return dataset and call close and doRelease', function(t) {

  //Arrange
  const mockResultMsg = 'mock results';
  const expectedResult =  [mockResultMsg];
  const close = sinon.stub().returns(Promise.resolve());
  const getRows = sinon.stub();
  // Second call returns an empty array to break out of the while loop
  getRows.onCall(0).returns(Promise.resolve(mockResultMsg));
  getRows.onCall(1).returns(Promise.resolve([]));

  const executeFunctionResult = {outBinds: {resultset: {close: close, getRows:getRows}}};
  const stubConnection = {
    'execute': sinon.stub().returns(executeFunctionResult)
  };
  let stubGetDBConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  const doRelease = sinon.stub();
  const executeCommand = rewire('../executeCommands');

  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': doRelease
  });

  const executeOracleFunction = executeCommand.executeOracleFunction;

  //Act
  executeOracleFunction(null, null, null)
    .then((result) => {
      t.deepEqual(result, expectedResult,'expected result should be returned');
      t.equals(doRelease.calledOnce, true, 'doRelease called once');
      t.end();
    }).catch((error) => {
      t.fail('This should not be accessed .catch block - ' + error.message);
      t.end();
    });
});


test('executeOracleFunction should return an empty dataset and call close and doRelease', function(t) {

  //Arrange
  const expectedResult =  null;
  const getRows = sinon.stub();
  // Second call returns an empty array to break out of the while loop
  getRows.onCall(0).returns(Promise.resolve(null));

  const executeFunctionResult = {outBinds: {resultset: null}};
  const stubConnection = {
    'execute': sinon.stub().returns(executeFunctionResult)
  };
  let stubGetDBConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  const doRelease = sinon.stub();
  const executeCommand = rewire('../executeCommands');

  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': doRelease
  });

  const executeOracleFunction = executeCommand.executeOracleFunction;

  //Act
  executeOracleFunction(null, null, null)
    .then((result) => {
      t.deepEqual(result, expectedResult,'expected result should be returned');
      t.equals(doRelease.calledOnce, true, 'doRelease called once');
      t.end();
    }).catch((error) => {
      t.fail('This should not be accessed .catch block - ' + error.message);
      t.end();
    });
});

test('executeOracleFunction should call connection.close with error', function(t) {

  //Arrange
  const mockErrorMsg = 'mock error';
  const expectedResult =  new Error (`[Error: Connection or Execution error: ${mockErrorMsg}]`);
  const close = sinon.stub().returns(Promise.resolve());
  const getRows = sinon.stub();
  // Second call returns an empty array to break out of the while loop
  getRows.onCall(0).returns(Promise.reject(mockErrorMsg));


  const executeFunctionResult = {outBinds: {resultset: {close: close, getRows:getRows}}};
  const stubConnection = {
    'execute': sinon.stub().returns(executeFunctionResult)
  };
  let stubGetDBConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  const doRelease = sinon.stub();
  const executeCommand = rewire('../executeCommands');

  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': doRelease
  });

  const executeOracleFunction = executeCommand.executeOracleFunction;

  //Act
  executeOracleFunction(null, null, null)
    .then((result) => {
      t.fail('This should not be accessed .then block - ' + result);
      t.end();
    }).catch((error) => {
      t.deepEqual(error, expectedResult,'expected result should be returned');
      t.equals(doRelease.calledOnce, true, 'doRelease called once');
      t.end();
    });
});

test('executeexecuteCommand should return single column and call doRelease', function(t) {

  //Arrange
  const stubColName = 'colName';
  const stubRowObject = {};
  stubRowObject[stubColName] = 'stub row';

  const stubConnectionResult = {rows:[stubRowObject], metaData: [{name: stubColName}]};
  const stubConnection = {
    'execute': sinon.stub().returns(stubConnectionResult)
  };
  let stubGetDBConnection = sinon.stub().returns(Promise.resolve(stubConnection));
  const doRelease = sinon.stub();
  const executeCommand = rewire('../executeCommands');

  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': doRelease
  });

  const executeOracleSelect = executeCommand.executeOracleSelect;
  const expectedResult = [stubConnectionResult.rows[0][stubColName]];

  //Act
  executeOracleSelect(null, null, null)
    .then((result) => {
      t.deepEqual(result, expectedResult,'expected result should be returned');
      t.equals(doRelease.calledOnce, true, 'doRelease called once');
      t.end();
    }).catch((error) => {
      t.fail('This should not be accessed .catch block - ' + error.message);
      t.end();
    });
});

test('executeOracleSelect should return multiple columns and call doRelease', function(t) {

  //Arrange
  const stubColName = 'colName';
  const stubRowObject = {};
  stubRowObject[stubColName] = 'stub row';

  const stubConnectionResult = {rows:[stubRowObject, stubRowObject], metaData: [{name: stubColName}, {name: stubColName}]};
  const stubConnection = {
    'execute': sinon.stub().returns(stubConnectionResult)
  };
  let stubGetDBConnection = sinon.stub().returns(Promise.resolve(stubConnection));
  const doRelease = sinon.stub();
  const executeCommand = rewire('../executeCommands');

  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': doRelease
  });

  const executeOracleSelect = executeCommand.executeOracleSelect;
  const expectedResult = stubConnectionResult.rows;

  //Act
  executeOracleSelect(null, null, null)
    .then((result) => {
      t.deepEqual(result, expectedResult,'expected result should be returned');
      t.equals(doRelease.calledOnce, true, 'doRelease called once');
      t.end();
    }).catch((error) => {
      t.fail('This should not be accessed .catch block - ' + error.message);
      t.end();
    });
});

test('executeOracleSelect should return and log error when execute throws error', function(t) {

  //Arrange
  let logger = {
    error: sinon.stub()
  };
  let stubError = 'stub error';
  let expectedError = 'Connection or Execution error: ' + stubError;
  let stubConnection = {
    'execute': sinon.stub().throws(stubError)
  };
  let stubGetDBConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  let doRelease = sinon.stub();
  let executeCommand = rewire('../executeCommands');


  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': doRelease,
    'logger': logger
  });

  let executeOracleSelect = executeCommand.executeOracleSelect;

  //Act
  executeOracleSelect(null, null, null)
    .then((result) => {
      t.fail('This should not be accessed .then block - ' + result);
      t.end();
    }).catch((error) => {
      t.equals(error.message, expectedError,'returned error should be equal to ' + expectedError);
      t.equals(logger.error.calledOnce, true, 'logger.error called once');
      t.end();
    });

});

test('executeOracleFunction fails to establish initial connection', function(t) {

  //Arrange
  let stubGetDBConnection = sinon.stub().returns(Promise.reject('mock reject'));
  let stubdoRelease = sinon.stub().returns(Promise.resolve('mock reject'));
  const executeCommand = rewire('../executeCommands');

  executeCommand.__set__({
    'dbSetup.getDBConnection': stubGetDBConnection,
    'dbSetup.doRelease': stubdoRelease
  });

  const executeOracleFunction = executeCommand.executeOracleFunction;

  //Act
  executeOracleFunction(null, null, null)
    .then((result) => {
      t.fail('This should not be accessed .catch block - ' + result.message);
      t.end();
    }).catch(() => {
      t.equals(stubGetDBConnection.calledOnce, true, 'getDBConnection called once (but failed)');
      t.equals(stubdoRelease.notCalled, true, 'doRelease not called');
      t.end();
    });
});
