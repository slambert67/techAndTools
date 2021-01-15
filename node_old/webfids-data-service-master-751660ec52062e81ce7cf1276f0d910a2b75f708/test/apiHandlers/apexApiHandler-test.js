let test = require('tape');
let rewire = require('rewire');
let sinon = require('sinon');
let sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

test('getLoggerOptions test where serverConfig.postLogsToLogService is true', function (t) {

  //Arrange
  let stubUrl = 'stub url';
  let getServiceUrl = sinon.stub().returns(stubUrl);
  let apexApiHandler = rewire('../../apiHandlers/apexApiHandler');
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

  apexApiHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'serverConfig ': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = apexApiHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, true, 'getServiceUrl has been called');
  t.end();
});

test('getLoggerOptions test where serverConfig.postLogsToLogService is false', function (t) {

  //Arrange
  let getServiceUrl = sinon.stub();
  let apexApiHandler = rewire('../../apiHandlers/apexApiHandler');
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

  apexApiHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'serverConfig': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = apexApiHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, false, 'getServiceUrl has not been called');
  t.end();
});

test('apexApiHandler.healthcheck resolves test', function (t) {
    let apexApiHandler = rewire('../../apiHandlers/apexApiHandler');
    let healthcheck = apexApiHandler.healthcheck;

    //Initialise variables
    let req = {};
    let res = {};
    let stubOptions = {};
    let request = {};
    let err = null;
    let response = {};
    let body = {};

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

    request = sinon.stub().yields(err, response, body);

    //Inject Mocks
    apexApiHandler.__set__({
        'request': request,
        'getServiceUrl': getServiceUrl
    });

    //Expected results
    let expectedData = {'system': 'APEX', 'message': 'OK'};

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
        .catch(err => {
            t.fail("apexApiHandler.healthcheck resolves test FAILED - " + err.toString());
            t.end();
        });

});

test('apexApiHandler.healthcheck rejects test', function (t) {
    let apexApiHandler = rewire('../../apiHandlers/apexApiHandler');
    let healthcheck = apexApiHandler.healthcheck;

    //Initialise variables
    let req = {};
    let res = {};
    let stubOptions = {};
    let request = {};
    let err = {};
    let response = {};
    let body = {};
    let logger = {};

    //Setup Spies
    logger.error = sinon.spy();

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
    apexApiHandler.__set__({
        'logger': logger,
        'request': request,
        'getServiceUrl': getServiceUrl
    });

    //Expected results
    let expectedError = {'system': 'APEX', 'message': err.message};

    //Execute Function under test
    healthcheck(req, res)
        .then(data => {
            t.fail("apexApiHandler.healthcheck rejects test FAILED - " + data.toString());
            t.end();
        })
        .catch(err => {
            //Assert results
            t.equals(request.calledOnce, true, 'request calledOnce as expected');
            t.equals(request.calledWith(stubOptions), true, 'request called with expected argument');
            t.equals(logger.error.calledOnce, true, 'logger.error calledOnce as expected');
            t.equals(logger.error.calledWith({error: err.message}, 'failed to get data from APEX API'), true, 'request called with expected argument');
            //Have to stringify both the result and expected result to get them to match for some reason
            t.equals(JSON.stringify(err), JSON.stringify(expectedError), 'healthcheck rejects with expected error');

            t.end();
        });

});
