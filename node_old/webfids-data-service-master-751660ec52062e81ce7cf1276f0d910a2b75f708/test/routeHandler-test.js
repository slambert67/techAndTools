let test = require('tape');
let rewire = require('rewire');
let sinon = require('sinon');
let sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);


test('getLoggerOptions test where serverConfig.postLogsToLogService is true', function (t) {

  //Arrange
  let stubUrl = 'stub url';
  let getServiceUrl = sinon.stub().returns(stubUrl);
  let routeHandler = rewire('../routeHandler');
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

  routeHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'serverConfig': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = routeHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, true, 'getServiceUrl has been called');
  t.end();
});

test('getLoggerOptions test where serverConfig.postLogsToLogService is false', function (t) {

  //Arrange
  let getServiceUrl = sinon.stub();
  let routeHandler = rewire('../routeHandler');
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

  routeHandler.__set__({
    'pkg': {
      name: 'stub name'
    },
    'serverConfig': serverConfig,
    'getServiceUrl': getServiceUrl
  });

  //Act
  let returnedOptions = routeHandler.__get__('getLoggerOptions')();

  //Assert
  t.deepEqual(expectedResult, returnedOptions, 'returned options should match expected result');
  t.equals(getServiceUrl.calledOnce, false, 'getServiceUrl has not been called');
  t.end();
});

test('healthcheck test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const healthcheck = routeHandler.healthcheck;
    const logger = {};
      logger.debug = sinon.spy();
      logger.info = sinon.spy();
      logger.error = sinon.spy();

    //Initialise Variables
    const req = {};
    const res = {};

    //Setup Spies
    res.header = sinon.spy();
    res.end = sinon.spy();

    //Inject mocks
    routeHandler.__set__({
        'logger': logger
    });

    //Execute function under test
    healthcheck(req, res);

    //Assert Results
    t.equals(res.header.calledOnce, true, 'req.header is called once');
    t.equals(res.header.calledWithExactly('Cache-Control', 'no-cache, no-store, max-age=0'), true, 'req.header is called with exactly the expected arguments');
    t.equals(res.end.calledOnce, true, 'req.end is calledOnce');
    t.equals(res.end.calledWithExactly('OK'), true, 'req.end is called with exactly the expected arguments');

    t.end();
});

test('underlyingApisHealthcheck success test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const underlyingApisHealthcheck = routeHandler.underlyingApisHealthcheck;

    //Initialise Variables
    const req = {};
    const res = {};
    const Promise = {};
    const aimsApiHandler = {};
    const apexApiHandler = {};
    const brsApiHandler = {};
    const logger = {};

    //Setup Spies
    res.send = sinon.spy();
    logger.debug = sinon.spy();
    aimsApiHandler.healthcheck = sinon.spy();
    apexApiHandler.healthcheck = sinon.spy();
    brsApiHandler.healthcheck = sinon.spy();

    //Setup Stubs
    const stubValues = [200, 200, 200];
    Promise.all = sinon.stub().returnsPromise();
    Promise.all.resolves(stubValues);

    //Inject mocks
    routeHandler.__set__({
        'logger': logger,
        'aimsApiHandler': aimsApiHandler,
        'apexApiHandler': apexApiHandler,
        'brsApiHandler': brsApiHandler,
        'Promise': Promise
    });

    //Execute function under test
    underlyingApisHealthcheck(req, res);

    const expectedDebug = 'Values: ' + stubValues;
    const expectedMessage = 'All healthchecks returned successfully';

    //Assert Results
    t.equals(Promise.all.calledOnce, true, 'Promise.all is called once');
    t.equals(aimsApiHandler.healthcheck.calledOnce, true, 'aimsApiHandler healthcheck is called once');
    t.equals(aimsApiHandler.healthcheck.calledWithExactly(req, res), true, 'aimsApiHandler called with expected arguments');
    t.equals(apexApiHandler.healthcheck.calledOnce, true, 'apexApiHandler healthcheck is called once');
    t.equals(apexApiHandler.healthcheck.calledWithExactly(req, res), true, 'apexApiHandler called with expected arguments');
    t.equals(brsApiHandler.healthcheck.calledOnce, true, 'brsApiHandler healthcheck is called once');
    t.equals(brsApiHandler.healthcheck.calledWithExactly(req, res), true, 'brsApiHandler called with expected arguments');
    t.equals(logger.debug.calledWithExactly(expectedDebug), true, 'Debug logging called as expected');
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(expectedMessage), true, 'res.send is called with exactly the expected message');
    t.end();
});

test('underlyingApisHealthcheck error test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const underlyingApisHealthcheck = routeHandler.underlyingApisHealthcheck;
    const logger = {};
      logger.debug = sinon.spy();
      logger.info = sinon.spy();
      logger.error = sinon.spy();

    //Initialise Variables
    const req = {};
    const res = {};
    const Promise = {};
    const stubError = {};
    const aimsApiHandler = {};
    const apexApiHandler = {};
    const brsApiHandler = {};

    //Setup Spies
    res.send = sinon.spy();
    aimsApiHandler.healthcheck = sinon.spy();
    apexApiHandler.healthcheck = sinon.spy();
    brsApiHandler.healthcheck = sinon.spy();

    //Setup Stubs
    stubError.system = 'Stub system';
    stubError.message = 'Stub error message';
    Promise.all = sinon.stub().returnsPromise();
    Promise.all.rejects(stubError);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler,
        'apexApiHandler': apexApiHandler,
        'brsApiHandler': brsApiHandler,
        'Promise': Promise, 'logger': logger
    });

    //Execute function under test
    underlyingApisHealthcheck(req, res);

    const expectedErrorMessage = Error(stubError.system + ': ' + stubError.message);

    //Assert Results
    t.equals(Promise.all.calledOnce, true, 'Promise.all is called once');
    t.equals(aimsApiHandler.healthcheck.calledOnce, true, 'aimsApiHandler healthcheck is called once');
    t.equals(aimsApiHandler.healthcheck.calledWithExactly(req, res), true, 'aimsApiHandler called with expected arguments');
    t.equals(apexApiHandler.healthcheck.calledOnce, true, 'apexApiHandler healthcheck is called once');
    t.equals(apexApiHandler.healthcheck.calledWithExactly(req, res), true, 'apexApiHandler called with expected arguments');
    t.equals(brsApiHandler.healthcheck.calledOnce, true, 'brsApiHandler healthcheck is called once');
    t.equals(brsApiHandler.healthcheck.calledWithExactly(req, res), true, 'brsApiHandler called with expected arguments');
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(expectedErrorMessage), true, 'res.send is called with exactly the expected Error');
    t.end();
});

test('resilientUnderlyingApisHealthcheck all apis resolve test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const resilientUnderlyingApisHealthcheck = routeHandler.resilientUnderlyingApisHealthcheck;
    const logger = {};
      logger.debug = sinon.spy();
      logger.info = sinon.spy();
      logger.error = sinon.spy();

    //Initialise Variables
    const req = {};
    const res = {};
    const Promise = {};
    const aimsApiHandler = {};
    const apexApiHandler = {};
    const brsApiHandler = {};
    const aimsHealthcheckResult = {};
    const aimsHealthcheckResultReflected = {};
    const apexHealthcheckResult = {};
    const apexHealthcheckResultReflected = {};
    const brsHealthcheckResult = {};
    const brsHealthcheckResultReflected = {};

    //Setup Spies
    res.send = sinon.spy();

    //Setup Stubs
    aimsHealthcheckResult.system = "AIMS";
    aimsHealthcheckResult.message = "OK";
    aimsHealthcheckResultReflected.status = "resolved";
    aimsHealthcheckResultReflected.data = aimsHealthcheckResult;
    aimsApiHandler.healthcheck = sinon.stub().returnsPromise();
    aimsApiHandler.healthcheck.resolves(aimsHealthcheckResult);

    apexHealthcheckResult.system = "APEX";
    apexHealthcheckResult.message = "OK";
    apexHealthcheckResultReflected.status = "resolved";
    apexHealthcheckResultReflected.data = apexHealthcheckResult;
    apexApiHandler.healthcheck = sinon.stub().returnsPromise();
    apexApiHandler.healthcheck.resolves(apexHealthcheckResult);

    brsHealthcheckResult.system = "BRS";
    brsHealthcheckResult.message = "OK";
    brsHealthcheckResultReflected.status = "resolved";
    brsHealthcheckResultReflected.data = brsHealthcheckResult;
    brsApiHandler.healthcheck = sinon.stub().returnsPromise();
    brsApiHandler.healthcheck.resolves(brsHealthcheckResult);

    const stubReflectedValues = [aimsHealthcheckResultReflected, apexHealthcheckResultReflected, brsHealthcheckResultReflected];
    Promise.all = sinon.stub().returnsPromise();
    Promise.all.resolves(stubReflectedValues);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler,
        'apexApiHandler': apexApiHandler,
        'brsApiHandler': brsApiHandler,
        'Promise': Promise, 'logger': logger
    });

    //Execute function under test
    resilientUnderlyingApisHealthcheck(req, res);

    const expectedMessage = {};
    expectedMessage.successes = [aimsHealthcheckResultReflected, apexHealthcheckResultReflected, brsHealthcheckResultReflected];
    expectedMessage.errors = [];

    //Assert Results
    t.equals(Promise.all.calledOnce, true, 'Promise.all is called once');
    t.equals(aimsApiHandler.healthcheck.calledOnce, true, 'aimsApiHandler healthcheck is called once');
    t.equals(aimsApiHandler.healthcheck.calledWithExactly(req, res), true, 'aimsApiHandler called with expected arguments');
    t.equals(apexApiHandler.healthcheck.calledOnce, true, 'apexApiHandler healthcheck is called once');
    t.equals(apexApiHandler.healthcheck.calledWithExactly(req, res), true, 'apexApiHandler called with expected arguments');
    t.equals(brsApiHandler.healthcheck.calledOnce, true, 'brsApiHandler healthcheck is called once');
    t.equals(brsApiHandler.healthcheck.calledWithExactly(req, res), true, 'brsApiHandler called with expected arguments');
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(expectedMessage), true, 'res.send is called with exactly the expected message');
    t.end();
});

test('resilientUnderlyingApisHealthcheck all apis reject test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const resilientUnderlyingApisHealthcheck = routeHandler.resilientUnderlyingApisHealthcheck;
    const logger = {};
      logger.debug = sinon.spy();
      logger.info = sinon.spy();
      logger.error = sinon.spy();

    //Initialise Variables
    const req = {};
    const res = {};
    const Promise = {};
    const aimsApiHandler = {};
    const apexApiHandler = {};
    const brsApiHandler = {};
    const aimsHealthcheckResult = {};
    const aimsHealthcheckResultReflected = {};
    const apexHealthcheckResult = {};
    const apexHealthcheckResultReflected = {};
    const brsHealthcheckResult = {};
    const brsHealthcheckResultReflected = {};

    //Setup Spies
    res.send = sinon.spy();

    //Setup Stubs
    aimsHealthcheckResult.system = "AIMS";
    aimsHealthcheckResult.message = "Aims error message";
    aimsHealthcheckResultReflected.status = "rejected";
    aimsHealthcheckResultReflected.error = aimsHealthcheckResult;
    aimsApiHandler.healthcheck = sinon.stub().returnsPromise();
    aimsApiHandler.healthcheck.rejects(aimsHealthcheckResult);

    apexHealthcheckResult.system = "APEX";
    apexHealthcheckResult.message = "Apex error message";
    apexHealthcheckResultReflected.status = "rejected";
    apexHealthcheckResultReflected.error = apexHealthcheckResult;
    apexApiHandler.healthcheck = sinon.stub().returnsPromise();
    apexApiHandler.healthcheck.rejects(apexHealthcheckResult);

    brsHealthcheckResult.system = "BRS";
    brsHealthcheckResult.message = "Brs error message";
    brsHealthcheckResultReflected.status = "rejected";
    brsHealthcheckResultReflected.error = brsHealthcheckResult;
    brsApiHandler.healthcheck = sinon.stub().returnsPromise();
    brsApiHandler.healthcheck.rejects(brsHealthcheckResult);

    const stubReflectedValues = [aimsHealthcheckResultReflected, apexHealthcheckResultReflected, brsHealthcheckResultReflected];
    Promise.all = sinon.stub().returnsPromise();
    Promise.all.resolves(stubReflectedValues);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler,
        'apexApiHandler': apexApiHandler,
        'brsApiHandler': brsApiHandler,
        'Promise': Promise, 'logger': logger
    });

    //Execute function under test
    resilientUnderlyingApisHealthcheck(req, res);

    const expectedMessage = {};
    expectedMessage.successes = [];
    expectedMessage.errors = [aimsHealthcheckResultReflected, apexHealthcheckResultReflected, brsHealthcheckResultReflected];

    //Assert Results
    t.equals(Promise.all.calledOnce, true, 'Promise.all is called once');
    t.equals(aimsApiHandler.healthcheck.calledOnce, true, 'aimsApiHandler healthcheck is called once');
    t.equals(aimsApiHandler.healthcheck.calledWithExactly(req, res), true, 'aimsApiHandler called with expected arguments');
    t.equals(apexApiHandler.healthcheck.calledOnce, true, 'apexApiHandler healthcheck is called once');
    t.equals(apexApiHandler.healthcheck.calledWithExactly(req, res), true, 'apexApiHandler called with expected arguments');
    t.equals(brsApiHandler.healthcheck.calledOnce, true, 'brsApiHandler healthcheck is called once');
    t.equals(brsApiHandler.healthcheck.calledWithExactly(req, res), true, 'brsApiHandler called with expected arguments');
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(500, expectedMessage), true, 'res.send is called with exactly the expected message');
    t.end();
});

test('resilientUnderlyingApisHealthcheck some apis resolve some apis reject test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const resilientUnderlyingApisHealthcheck = routeHandler.resilientUnderlyingApisHealthcheck;
    const logger = {};
      logger.debug = sinon.spy();
      logger.info = sinon.spy();
      logger.error = sinon.spy();

    //Initialise Variables
    const req = {};
    const res = {};
    const Promise = {};
    const aimsApiHandler = {};
    const apexApiHandler = {};
    const brsApiHandler = {};
    const aimsHealthcheckResult = {};
    const aimsHealthcheckResultReflected = {};
    const apexHealthcheckResult = {};
    const apexHealthcheckResultReflected = {};
    const brsHealthcheckResult = {};
    const brsHealthcheckResultReflected = {};

    //Setup Spies
    res.send = sinon.spy();

    //Setup Stubs
    aimsHealthcheckResult.system = "AIMS";
    aimsHealthcheckResult.message = "OK";
    aimsHealthcheckResultReflected.status = "resolved";
    aimsHealthcheckResultReflected.data = aimsHealthcheckResult;
    aimsApiHandler.healthcheck = sinon.stub().returnsPromise();
    aimsApiHandler.healthcheck.resolves(aimsHealthcheckResult);

    apexHealthcheckResult.system = "APEX";
    apexHealthcheckResult.message = "OK";
    apexHealthcheckResultReflected.status = "resolved";
    apexHealthcheckResultReflected.data = apexHealthcheckResult;
    apexApiHandler.healthcheck = sinon.stub().returnsPromise();
    apexApiHandler.healthcheck.resolves(apexHealthcheckResult);

    brsHealthcheckResult.system = "BRS";
    brsHealthcheckResult.message = "Brs error message";
    brsHealthcheckResultReflected.status = "rejected";
    brsHealthcheckResultReflected.error = brsHealthcheckResult;
    brsApiHandler.healthcheck = sinon.stub().returnsPromise();
    brsApiHandler.healthcheck.rejects(brsHealthcheckResult);

    const stubReflectedValues = [aimsHealthcheckResultReflected, apexHealthcheckResultReflected, brsHealthcheckResultReflected];
    Promise.all = sinon.stub().returnsPromise();
    Promise.all.resolves(stubReflectedValues);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler,
        'apexApiHandler': apexApiHandler,
        'brsApiHandler': brsApiHandler,
        'Promise': Promise, 'logger': logger
    });

    //Execute function under test
    resilientUnderlyingApisHealthcheck(req, res);

    const expectedMessage = {};
    expectedMessage.successes = [aimsHealthcheckResultReflected, apexHealthcheckResultReflected];
    expectedMessage.errors = [brsHealthcheckResultReflected];

    //Assert Results
    t.equals(Promise.all.calledOnce, true, 'Promise.all is called once');
    t.equals(aimsApiHandler.healthcheck.calledOnce, true, 'aimsApiHandler healthcheck is called once');
    t.equals(aimsApiHandler.healthcheck.calledWithExactly(req, res), true, 'aimsApiHandler called with expected arguments');
    t.equals(apexApiHandler.healthcheck.calledOnce, true, 'apexApiHandler healthcheck is called once');
    t.equals(apexApiHandler.healthcheck.calledWithExactly(req, res), true, 'apexApiHandler called with expected arguments');
    t.equals(brsApiHandler.healthcheck.calledOnce, true, 'brsApiHandler healthcheck is called once');
    t.equals(brsApiHandler.healthcheck.calledWithExactly(req, res), true, 'brsApiHandler called with expected arguments');
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(expectedMessage), true, 'res.send is called with exactly the expected message');
    t.end();
});

test('resilientUnderlyingApisHealthcheck Promise all reject test', function (t) {

    //Grab the function under test
    const routeHandler = rewire('../routeHandler');
    const resilientUnderlyingApisHealthcheck = routeHandler.resilientUnderlyingApisHealthcheck;

    //Initialise Variables
    const req = {};
    const res = {};
    const Promise = {};
    const aimsApiHandler = {};
    const apexApiHandler = {};
    const brsApiHandler = {};
    const logger = {};

    //Setup Spies
    res.send = sinon.spy();
    logger.debug = sinon.spy();

    //Setup Stubs
    aimsApiHandler.healthcheck = sinon.stub().returnsPromise();
    aimsApiHandler.healthcheck.resolves({});

    apexApiHandler.healthcheck = sinon.stub().returnsPromise();
    apexApiHandler.healthcheck.resolves({});

    brsApiHandler.healthcheck = sinon.stub().returnsPromise();
    brsApiHandler.healthcheck.rejects({});

    const stubPromiseAllReject = "Error with Promise.all()";
    Promise.all = sinon.stub().returnsPromise();
    Promise.all.rejects(stubPromiseAllReject);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler,
        'apexApiHandler': apexApiHandler,
        'brsApiHandler': brsApiHandler,
        'logger': logger,
        'Promise': Promise
    });

    //Execute function under test
    resilientUnderlyingApisHealthcheck(req, res);

    const expectedError = Error(stubPromiseAllReject);

    //Assert Results
    t.equals(Promise.all.calledOnce, true, 'Promise.all is called once');
    t.equals(aimsApiHandler.healthcheck.calledOnce, true, 'aimsApiHandler healthcheck is called once');
    t.equals(aimsApiHandler.healthcheck.calledWithExactly(req, res), true, 'aimsApiHandler called with expected arguments');
    t.equals(apexApiHandler.healthcheck.calledOnce, true, 'apexApiHandler healthcheck is called once');
    t.equals(apexApiHandler.healthcheck.calledWithExactly(req, res), true, 'apexApiHandler called with expected arguments');
    t.equals(brsApiHandler.healthcheck.calledOnce, true, 'brsApiHandler healthcheck is called once');
    t.equals(brsApiHandler.healthcheck.calledWithExactly(req, res), true, 'brsApiHandler called with expected arguments');
    t.equals(logger.debug.calledOnce, true, 'logger.debug is called once as expected');
    t.equals(logger.debug.calledWithExactly('Should never get here as promiseReflect always resolves?'), true, 'logger.debug is called with exactly the expected message');
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(expectedError), true, 'res.send is called with exactly the expected message');
    t.end();
});

test('getPageDataBykey returns data', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };
    const mockData = 'mock data';

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getPageDataByKey = sinon.stub().returnsPromise();
    aimsApiHandler.getPageDataByKey.resolves([mockData]);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    let expectedStatusCode = 201;
    let expectedData = [mockData];

    //Act
    routeHandler.getPageDataByKey(req, res);

    // Assert
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly( expectedStatusCode, expectedData ), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getPageDataBykey returns Error', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };

    const errorObject = {
        statusCode : 123,
        error : 'Test error msg'
    };

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getPageDataByKey = sinon.stub().returnsPromise();
    aimsApiHandler.getPageDataByKey.rejects(errorObject);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    //Act
    routeHandler.getPageDataByKey(req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly( errorObject.statusCode, errorObject ), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getPageDataBykey responds with 204 when no data is returned ', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getPageDataByKey = sinon.stub().returnsPromise();
    aimsApiHandler.getPageDataByKey.resolves(null);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    //Act
    routeHandler.getPageDataByKey(req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(204), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getPageTemplateByKey returns data', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };
    const mockData = 'mock data';

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getPageTemplateByKey = sinon.stub().returnsPromise();
    aimsApiHandler.getPageTemplateByKey.resolves(mockData);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    let expectedStatusCode = 201;
    let expectedData = mockData;

    //Act
    routeHandler.getPageTemplateByKey (req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly( expectedStatusCode, expectedData ), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getPageTemplateByKey returns Error', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };

    const errorObject = {
        statusCode : 123,
        error : 'Test error msg'
    };

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getPageTemplateByKey = sinon.stub().returnsPromise();
    aimsApiHandler.getPageTemplateByKey.rejects(errorObject);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    //Act
    routeHandler.getPageTemplateByKey (req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly( errorObject.statusCode, errorObject ), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getPageTemplateByKey responds with 204 when no data is returned ', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getPageTemplateByKey  = sinon.stub().returnsPromise();
    aimsApiHandler.getPageTemplateByKey .resolves(null);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    //Act
    routeHandler.getPageTemplateByKey (req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(204), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getCurrentPageForDevice returns data', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };
    const mockData = 'mock data';

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getCurrentPageForDevice = sinon.stub().returnsPromise();
    aimsApiHandler.getCurrentPageForDevice.resolves([mockData]);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    let expectedStatusCode = 201;
    let expectedData = [mockData];

    //Act
    routeHandler.getCurrentPageForDevice(req, res);

    // Assert
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly( expectedStatusCode, expectedData ), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getCurrentPageForDevice responds with 204 when no data is returned ', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getCurrentPageForDevice  = sinon.stub().returnsPromise();
    aimsApiHandler.getCurrentPageForDevice .resolves(null);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    //Act
    routeHandler.getCurrentPageForDevice (req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly(204), true, 'res.send is called with exactly the expected message');
    t.end();

});

test('getCurrentPageForDevice returns Error', function(t) {

    //Arrange
    let routeHandler = rewire('../routeHandler');

    //Initialise Variables
    const res = {};
    const aimsApiHandler = {};
    const req = {
        params: {keyPage: 2, siteId: 'ULT'},
        logger: {error: sinon.stub(), trace: sinon.stub()}
    };

    const errorObject = {
        statusCode : 123,
        error : 'Test error msg'
    };

    //Setup Spies
    res.send = sinon.spy();

    aimsApiHandler.getCurrentPageForDevice = sinon.stub().returnsPromise();
    aimsApiHandler.getCurrentPageForDevice.rejects(errorObject);

    //Inject mocks
    routeHandler.__set__({
        'aimsApiHandler': aimsApiHandler
    });

    //Act
    routeHandler.getCurrentPageForDevice (req, res);
    t.equals(res.send.calledOnce, true, 'res.send is called once');
    t.equals(res.send.calledWithExactly( errorObject.statusCode, errorObject ), true, 'res.send is called with exactly the expected message');
    t.end();

});
