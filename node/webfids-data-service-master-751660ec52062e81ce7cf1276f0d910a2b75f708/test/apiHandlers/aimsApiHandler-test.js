let test = require('tape');
let rewire = require('rewire');
let sinon = require('sinon');
let sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
const serverConfig = require('../../server.config');
const aimsApiHandler = require('../../apiHandlers/aimsApiHandler');


test('getLoggerOptions test where config.postLogsToLogService is true', function (t) {

  //Arrange
  let stubUrl = 'stub url';
  let getServiceUrl = sinon.stub().returns(stubUrl);
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  let expectedResult = {
    callingService: 'stub name',
    loglevel: 'stub log level',
    postLogsToLogService: true,
    urlToPostTo: stubUrl
  };

  let serverConfig = {
    loglevel: 'stub log level',
    postLogsToLogService: true
  };

  aimsApiHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'serverConfig ': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = aimsApiHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, true, 'getServiceUrl has been called');
  t.end();
});

test('getLoggerOptions test where config.postLogsToLogService is false', function (t) {

  //Arrange
  let getServiceUrl = sinon.stub();
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  let expectedResult = {
    callingService: 'stub name',
    loglevel: 'stub log level',
    postLogsToLogService: false,
    urlToPostTo: null
  };

  let serverConfig = {
    loglevel: 'stub log level',
    postLogsToLogService: false
  };

  aimsApiHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'serverConfig': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = aimsApiHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, false, 'getServiceUrl has not been called');
  t.end();
});

test('aimsApiHandler.healthcheck resolves test', function (t) {
    let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
    let healthcheck = aimsApiHandler.healthcheck;

    //Initialise variables
    let req = {};
    let res = {};
    let stubOptions = {};
    let err = null;
    let request = {};
    let response = {};
    let body = {};

    //Setup Stubs
    req.user = 'Stub user';
    req.requestId = 'Stub request id';

    let stubServiceUrl = 'http://stub-service/v123/stubEndpoint';
    let getServiceUrl = sinon.stub().returns(stubServiceUrl);

    stubOptions.url = stubServiceUrl;
    stubOptions.method = 'GET';
    stubOptions.headers = {
        'user': JSON.stringify(req.user),
        'x-request-id': req.requestId
    };

    request = sinon.stub().yields(err, response, body);

    //Inject Mocks
    aimsApiHandler.__set__({
        'request': request,
        'getServiceUrl': getServiceUrl
    });

    //Expected results
    let expectedData = {'system': 'AIMS', 'message': 'OK'};

    //Execute Function under test
    healthcheck(req, res)
        .then(data => {
            //Assert results
            t.equals(request.calledOnce, true, 'request calledOnce as expected');
            t.equals(request.calledWith(stubOptions), true, 'request called with expected argument');
            //Have to stringify both the result and expected result to get them to match for some reason
            t.equals(JSON.stringify(data), JSON.stringify(expectedData), 'healthcheck resolves with expected data');
            t.end();
        })
        .catch(error => {
            t.fail('aimsApiHandler.healthcheck resolves test FAILED - ' + error.toString());
            t.end();
        });

});

test('aimsApiHandler.healthcheck rejects test', function (t) {
    let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
    let healthcheck = aimsApiHandler.healthcheck;

    //Initialise variables
    let req = {};
    let res = {};
    let stubOptions = {};
    let request = {};
    let response = {};
    let err = {};
    let body = {};
    let logger = {};

    //Setup Spies
    logger.error = sinon.stub();

    //Setup Stubs
    req.user = 'Stub user';
    req.requestId = 'Stub request id';

    let stubServiceUrl = "http://stub-service/v123/stubEndpoint";
    let getServiceUrl = sinon.stub().returns(stubServiceUrl);

    stubOptions.url = stubServiceUrl;
    stubOptions.method = 'GET';
    stubOptions.headers = {
        'user': JSON.stringify(req.user),
        'x-request-id': req.requestId
    };

    err.message = 'stubError';

    request = sinon.stub().yields(err, response, body);

    //Inject Mocks
    aimsApiHandler.__set__({
        'logger': logger,
        'request': request,
        'getServiceUrl': getServiceUrl
    });

    //Expected results
    let expectedError = {'system': 'AIMS', 'message': err.message};

    //Execute Function under test
    healthcheck(req, res)
        .then(data => {
            t.fail('aimsApiHandler.healthcheck rejects test FAILED - ' + data.toString());
            t.end();
        })
        .catch(error => {
            //Assert results
            t.equals(request.calledOnce, true, 'request calledOnce as expected');
            t.equals(request.calledWith(stubOptions), true, 'request called with expected argument');
            t.equals(logger.error.calledOnce, true, 'logger.error calledOnce as expected');
            t.equals(logger.error.calledWith({error: err.message}, 'failed to get data from AIMS API'), true, 'request called with expected argument');
            //Have to stringify both the result and expected result to get them to match for some reason
            t.equals(JSON.stringify(error), JSON.stringify(expectedError), 'healthcheck rejects with expected error');

            t.end();
        });

});

test('getPageDataByKey - parameter validation failure', function (t){

  let req = {params: {keyPage:1},
             logger: {error : sinon.stub()}};

  let expectedError = {
    'system': serverConfig.system,
    'statusCode': 400,
    'message': 'Required parameters keyPage and siteId not supplied'
  };

  aimsApiHandler.getPageDataByKey(req, null)
    .then((res)=>{
      t.fail('This should not be accessed .then block - '+ res);
      t.end();
    })
    .catch((error)=>{
      t.equals(error.message, expectedError.message);
      t.deepEquals(error, expectedError );
      t.end();
    });
});

test('getPageDataByKey should return Page Data', function(t) {

  //Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  const mockData = ['[{"value":"Result"}]'];
  const expectedResult = JSON.parse(mockData);
  let executeOracleFunction = sinon.stub().returns(Promise.resolve(mockData));
  aimsApiHandler.__set__('executeOracleFunction', executeOracleFunction);

  let req = {
    params: {keyPage: 2, siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };

  //Act
  aimsApiHandler.getPageDataByKey(req)
    .then((res) => {
      t.deepEqual(res, [expectedResult], 'returned msg should equal expected result');
      t.end();
    }).catch((error) => {
        t.fail('This should not be accessed .catch block - ' + error.message);
        t.end();
      });
});

test('getPageDataByKey, No Page Data found', function(t) {

  //Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');

  let expectedResult = [];

  let executeOracleFunction = sinon.stub();
  //Pass through the first call to executeOracleSelect but then fail on the second call
  executeOracleFunction.onCall(0).returns(Promise.resolve(expectedResult));
  aimsApiHandler.__set__('executeOracleFunction', executeOracleFunction);

  let req = {
    params: {keyPage: 2, siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };

  //Act
  aimsApiHandler.getPageDataByKey(req)
    .then((res) => {
      t.equals(res, null, 'returned Page Data should be null');
      t.end();
    }).catch((error) => {
    t.fail('This should not be accessed .catch block - ' + error.message);
    t.end();
  });
});

test('getPageDataByKey, Error fetching Page Data', function(t) {

  //Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');

  let mockErrorMsg = {message: 'Mock Page Data Select Error Msg'};

  let executeOracleFunction = sinon.stub();
  //Pass through the first call to executeOracleSelect but then fail on the second call
  executeOracleFunction.onCall(0).returns(Promise.reject(mockErrorMsg));

  aimsApiHandler.__set__('executeOracleFunction', executeOracleFunction);

  let req = {
    params: {keyPage: 2, siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };

  let expectedError = {
    'system': serverConfig.system,
    'statusCode': 400,
    'message': 'Error fetching page data for page:' + req.params.keyPage + '-' + mockErrorMsg.message
  };

  //Act
  aimsApiHandler.getPageDataByKey(req, null)
    .then((res) => {
      t.fail('This should not be accessed .then block - ' + res);
      t.end();
    }).catch((error) => {
    t.deepEquals(error, expectedError);
    t.end();
  });
});

test('getPageTemplateByKey - parameter validation failure', function (t){

  let req = {params: {keyPage:1},
    logger: {error : sinon.stub()}};

  let expectedError = {
    'system': serverConfig.system,
    'statusCode': 400,
    'message': 'Required parameters keyPage and siteId not supplied'
  };

  aimsApiHandler.getPageTemplateByKey(req, null)
    .then((res)=>{
      t.fail('This should not be accessed .then block - '+ res);
      t.end();
    })
    .catch((error)=>{
      t.equals(error.message, expectedError.message);
      t.deepEquals(error, expectedError );
      t.end();
    });
});

test('getPageTemplateByKey should return Page Template', function(t) {

  // Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  const mockData = { pageTemplate: 'mock template' };
  let returnedData = [JSON.stringify(mockData)];

  let executeOracleSelect = sinon.stub().returns(Promise.resolve(returnedData));
  aimsApiHandler.__set__('executeOracleSelect', executeOracleSelect);

  let req = {
    params: {keyPage: 2, siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };

  // Act
  aimsApiHandler.getPageTemplateByKey(req, null)
    .then((res) => {
      t.deepEqual(res, returnedData, 'returned msg should equal expected result');
      t.end();
    }).catch((error) => {
    t.fail('This should not be accessed .catch block - ' + error.message);
    t.end();
  });
});

test('getPageTemplateByKey, No Page Template found', function(t) {

  //Arrange
  let emptyArray = [];
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  let executeOracleSelect = sinon.stub().returns(Promise.resolve(emptyArray));

  aimsApiHandler.__set__('executeOracleSelect', executeOracleSelect);

  let req = {
    params: {keyPage: 2, siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };

  //Act
  aimsApiHandler.getPageTemplateByKey(req, null)
    .then((res) => {
      t.equals(res, emptyArray, 'returned page template should be null');
      t.end();
    })
    .catch((error) => {
      t.fail('This should not be accessed .catch block - ' + error);
      t.end();
    });
});

test('getPageTemplateByKey, Error fetching Page Template', function(t) {

  //Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  let req = {
    params: {keyPage: 2, siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };
  let logger = {};
  logger.error = sinon.stub();

  const errorMsg = 'Mock Error';
  const expectedErrorMsg = {
    'system': 'WEBFIDS',
    'statusCode': 400,
    'message': 'Error fetching page select stmt for page:' + req.params.keyPage + '-' + errorMsg
  };

  let executeOracleSelect = sinon.stub().returnsPromise().rejects(new Error(errorMsg));
  aimsApiHandler.__set__('executeOracleSelect', executeOracleSelect);

  //Act
  aimsApiHandler.getPageTemplateByKey(req)
    .then((res) => {
      t.fail('This should not be accessed .then block - ' + res);
      t.end();
    })
    .catch((error) => {
      t.deepEquals(error, expectedErrorMsg);
      t.end();
    });
});

test('getCurrentPageForDevice - parameter validation failure', function (t){

  let req = {params: {testParam:1},
    logger: {error : sinon.stub()}};

  let expectedError = {
    'system': serverConfig.system,
    'statusCode': 400,
    'message': 'Required parameters ipAddress and siteId not supplied'
  };

  aimsApiHandler.getCurrentPageForDevice(req, null)
    .then((res)=>{
      t.fail('This should not be accessed .then block - '+ res);
      t.end();
    })
    .catch((error)=>{
      t.equals(error.message, expectedError.message);
      t.deepEquals(error, expectedError );
      t.end();
    });
});

test('getCurrentPageForDevice should return page number', function(t) {

  // Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  const mockData = { pageTemplate: 'mock template' };
  let returnedData = [JSON.stringify(mockData)];

  let executeOracleSelect = sinon.stub().returns(Promise.resolve(returnedData));
  aimsApiHandler.__set__('executeOracleSelect', executeOracleSelect);

  let req = {
    params: {ipAddress: 'test device', siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };

  // Act
  aimsApiHandler.getCurrentPageForDevice(req, null)
    .then((res) => {
      t.deepEqual(res, returnedData, 'returned msg should equal expected result');
      t.end();
    }).catch((error) => {
    t.fail('This should not be accessed .catch block - ' + error.message);
    t.end();
  });
});

test('getCurrentPageForDevice, Error fetching Page Template', function(t) {

  //Arrange
  let aimsApiHandler = rewire('../../apiHandlers/aimsApiHandler');
  let req = {
    params: {ipAddress: 'test device', siteId: 'ULT'},
    logger: {error: sinon.stub()}
  };
  let logger = {};
  logger.error = sinon.stub();

  const errorMsg = 'Mock Error';
  const expectedErrorMsg = {
    'system': 'WEBFIDS',
    'statusCode': 400,
    'message': 'Error fetching pages to display for ipAddress:' + req.params.ipAddress + '-' + errorMsg
  };

  let executeOracleSelect = sinon.stub().returnsPromise().rejects(new Error(errorMsg));
  aimsApiHandler.__set__('executeOracleSelect', executeOracleSelect);

  //Act
  aimsApiHandler.getCurrentPageForDevice(req)
    .then((res) => {
      t.fail('This should not be accessed .then block - ' + res);
      t.end();
    })
    .catch((error) => {
      t.deepEquals(error, expectedErrorMsg);
      t.end();
    });
});

