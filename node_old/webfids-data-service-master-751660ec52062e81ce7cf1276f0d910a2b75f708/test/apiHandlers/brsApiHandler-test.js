const test = require('tape');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

test('getLoggerOptions test where config.postLogsToLogService is true', function (t) {

  //Arrange
  let stubUrl = 'stub url';
  let getServiceUrl = sinon.stub().returns(stubUrl);
  let brsApiHandler = rewire('../../apiHandlers/brsApiHandler');
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

  brsApiHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'config': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = brsApiHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, true, 'getServiceUrl has been called');
  t.end();
});

test('getLoggerOptions test where config.postLogsToLogService is false', function (t) {

  //Arrange
  let getServiceUrl = sinon.stub();
  let brsApiHandler = rewire('../../apiHandlers/brsApiHandler');
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

  brsApiHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'config': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = brsApiHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, false, 'getServiceUrl has not been called');
  t.end();
});

test('brsApiHandler.healthcheck resolves test', function (t) {
    const brsApiHandler = rewire('../../apiHandlers/brsApiHandler');
    const healthcheck = brsApiHandler.healthcheck;
    const logger = {};
    logger.debug = sinon.spy();
    logger.info = sinon.spy();
    logger.error = sinon.spy();

    //Initialise variables
    const req = {};
    const res = {};
    const stubOptions = {};
    let request = {};
    const err = null;
    const response = {};
    const body = {};
    const config = {};

    //Setup Stubs
    req.user = 'Stub user';
    req.requestId = 'Stub request id';

    let stubServiceUrl = `http://stub-service:1234/v1/stubEndpoint`;
    let getServiceUrl = sinon.stub().returns(stubServiceUrl);

    stubOptions.url = stubServiceUrl;

    stubOptions.method = 'GET';
    stubOptions.headers = {
        'user': JSON.stringify(req.user),
        'x-request-id': req.requestId
    };

    request = sinon.stub().yields(err, response, body);

    //Inject Mocks
    brsApiHandler.__set__({
        'request': request,
        'getServiceUrl': getServiceUrl,
        'config': config, 'logger': logger
    });

    //Expected results
    const expectedData = {'system': config.system, 'message': 'OK'};

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
        .catch(() => {
            t.equals(true, false, "This statement shouldn't be called!");
            t.end();
        });

});

test('brsApiHandler.healthcheck rejects test', function (t) {
    const brsApiHandler = rewire('../../apiHandlers/brsApiHandler');
    const healthcheck = brsApiHandler.healthcheck;

    //Initialise variables
    const req = {};
    const res = {};
    const stubOptions = {};
    let request = {};
    const err = {};
    const response = {};
    const body = {};
    const config = {};

    //Setup Spies
    const logger = {
        error: sinon.spy(),
        info: sinon.spy()
    };

    //Setup Stubs
    req.user = 'Stub user';
    req.requestId = 'Stub request id';

    let stubServiceUrl = `http://stub-service:1234/v1/stubEndpoint`;
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
    brsApiHandler.__set__({
        'logger': logger,
        'request': request,
        'config': config,
        'getServiceUrl': getServiceUrl

    });

    //Expected results
    const expectedError = {'system': config.system, 'message': err.message};

    //Execute Function under test
    healthcheck(req, res)
        .then(() => {
            t.equals(true, false, "This statement shouldn't be called!");
            t.end();
        })
        .catch(err => {
            //Assert results
            t.equals(request.calledOnce, true, 'request calledOnce as expected');
            t.equals(request.calledWith(stubOptions), true, 'request called with expected argument');
            t.equals(logger.error.calledOnce, true, 'logger.error calledOnce as expected');
            t.equals(logger.error.calledWith({error: err.message}, 'failed to get data from BRS API'), true, 'request called with expected argument');
            t.deepEquals(err, expectedError, 'healthcheck rejects with expected error');
            t.end();
        });
});

