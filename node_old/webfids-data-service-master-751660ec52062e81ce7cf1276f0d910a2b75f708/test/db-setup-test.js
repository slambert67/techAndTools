var test = require('tape');
let rewire = require('rewire');
let sinon = require('sinon');

test('getDbConfig should return db config', (t) => {

  // Arrange
  let mockConnectString = 'mock string';
  let mockConfig = {dbConnectionSettings: {connectString: mockConnectString}};
  let dbSetup = rewire('../db-setup');
  dbSetup.__set__({config: mockConfig});

  // Act
  let returnedConfig = dbSetup.__get__('getDbConfig')();

  // Assert
  t.equals(returnedConfig.connectString, mockConnectString);
  t.end();
});

test('createPool resolve with a created pool', (t) => {
  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockPool = 'mock pool';
  let stubOracledb = {
    createPool: sinon.stub().yields(null,mockPool)
  };

  dbSetup.__set__({oracledb: stubOracledb});

  // Act
  dbSetup.__get__('createPool')()

    // Assert
    .then(() => {
      t.equals(dbSetup.getPool(), mockPool, 'createPool returns expected pool');
      t.end();
    })

    .catch(() => {
      t.fail('createPool should not reject the promise');
      t.end();
    });
});

test('createPool resolve with a created pool', (t) => {
  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockError = 'mock error';
  let stubOracledb = {
    createPool: sinon.stub().yields(mockError,null)
  };

  dbSetup.__set__({oracledb: stubOracledb});

  // Act
  dbSetup.__get__('createPool')()

  // Assert
    .then(() => {
      t.fail('createPool should reject the promise');
      t.end();
    })

    .catch(err => {
      t.equals(err, mockError, 'createPool promise rejects with error');
      t.end();
    });
});

test('should call pool.terminate and resolve the promise when pool is defined and does not return an error', t => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockPool = {
    terminate: sinon.stub().yields(null)
  };

  dbSetup.__set__({pool: mockPool});

  // Act
  dbSetup.__get__('terminatePool')()

  // Assert
    .then(() => {
      t.pass('promise resolves');
      t.equals(mockPool.terminate.calledOnce, true, 'pool.terminate called once');
      t.end();
    })
    .catch(() => {
      t.fail('promise should resolve');
      t.end();
    });

});

test('should resolve if pool is not defined', t => {
  // Arrange
  let dbSetup = rewire('../db-setup');

  // Act
  dbSetup.__get__('terminatePool')()

  // Assert
    .then(() => {
      t.pass('promise resolves');
      t.end();
    })
    .catch(() => {
      t.fail('promise should resolve');
      t.end();
    });

});

test('should call pool.terminate and reject the promise when pool is defined and returns error', t => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockPool = {
    terminate: sinon.stub().yields('mock error')
  };

  dbSetup.__set__({pool: mockPool});

  // Act
  dbSetup.__get__('terminatePool')()

  // Assert
    .then(() => {
      t.fail('promise should reject');
      t.end();
    })
    .catch(() => {
      t.equals(mockPool.terminate.calledOnce, true, 'pool.terminate called once');
      t.end();
    });

});

test('getPool should return pool', t => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockPool = 'mock pool';

  dbSetup.__set__({pool: mockPool});

  // Act
  let response = dbSetup.__get__('getPool')();

  // Assert
  t.equals(response, mockPool, 'returns the correct pool value');
  t.end();

});

test('getDb should call getPool if pool is defined', t => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockPool = 'mock pool';
  let stubGetPool = sinon.stub();

  dbSetup.__set__({
    pool: mockPool,
    getPool: stubGetPool
  });

  // Act
  dbSetup.__get__('getDb')();

  // Assert
  t.equals(stubGetPool.calledOnce, true, 'getPool called');
  t.end();

});

test('getDb return oracledb if pool is not defined', t => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockOracleDb = 'mock db';
  let stubGetPool = sinon.stub();

  dbSetup.__set__({
    oracledb: mockOracleDb,
    getPool: stubGetPool
  });

  // Act
  let response = dbSetup.__get__('getDb')();

  // Assert
  t.equals(stubGetPool.called, false, 'getPool not called');
  t.equals(response, mockOracleDb, 'returns oracledb');
  t.end();

});

test('encrypt should call encryptWithCypher', (t) => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let stubStringToEncrypt = 'mock string';
  let stubAlgorithm = 'mock algorithm';
  let mockPassword = 'mock password';
  let mockEncryptWithCypher = sinon.stub();
  dbSetup.__set__({encryptWithCypher: mockEncryptWithCypher});

  // Act
  dbSetup.__get__('encrypt')(stubStringToEncrypt, stubAlgorithm, mockPassword);

  // Assert
  t.equals(mockEncryptWithCypher.calledOnce, true, 'encryptWithCypher called once');
  t.end();
});

test('decrypt should call decryptWithCypher', (t) => {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let stubStringToEncrypt = 'mock string';
  let stubAlgorithm = 'mock algorithm';
  let mockPassword = 'mock password';
  let mockDecryptWithCypher = sinon.stub();
  dbSetup.__set__({decryptWithCypher: mockDecryptWithCypher});

  // Act
  dbSetup.__get__('decrypt')(stubStringToEncrypt, stubAlgorithm, mockPassword);

  // Assert
  t.equals(mockDecryptWithCypher.calledOnce, true, 'decryptWithCypher called once');
  t.end();
});

test('getDbConfig should return an object of dbConnectionSettings from the serverConfig', function(t) {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let mockDbConnectionSettings ={
    connectString: 'mock connect string',
    initSession: 'mock session',
    user: 'mock user',
    password: 'mock password'
  };

  dbSetup.__set__({config:{dbConnectionSettings:{connectString: mockDbConnectionSettings.connectString,
        initSession : mockDbConnectionSettings.initSession,
        user: mockDbConnectionSettings.user,
        password: mockDbConnectionSettings.password}}});

  // Act
  let results = dbSetup.getDbConfig();

  // Assert
  t.deepEqual(results, mockDbConnectionSettings, 'returned config should match expected result');
  t.end();


});

test('encryptWithCypher should return a composed cyphered string', (t)=> {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let stubStringToEncrypt = 'mock string';
  let stubAlgorithm = 'mock algorithm';
  let mockPassword = 'mock password';

  let mockCryptedString = 'cryptedstring/';
  let mockCryptedPostfix = 'hex';

  let stubCipher = {
    update: sinon.stub().returns(mockCryptedString),
    final: sinon.stub().returns(mockCryptedPostfix)
  };

  let stubCrypto = {
    createCipher: sinon.stub().returns(stubCipher)
  };

  dbSetup.__set__({crypto: stubCrypto});

  // Act
  let results = dbSetup.__get__('encryptWithCypher')(stubStringToEncrypt, stubAlgorithm, mockPassword);

  // Assert
  t.equals(results, mockCryptedString + mockCryptedPostfix, 'the composed cypher should be returned');
  t.end();

});

test('decryptWithCypher should decrypt the passed string', (t)=> {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let stubStringToEncrypt = 'mock string';
  let stubAlgorithm = 'mock algorithm';
  let mockPassword = 'mock password';

  let mockDecryptedString = 'decryptedstring/';
  let mockDecryptedPostfix = 'hex';

  let stubDecipher = {
    update: sinon.stub().returns(mockDecryptedString),
    final: sinon.stub().returns(mockDecryptedPostfix)
  };

  let stubCrypto = {
    createDecipher: sinon.stub().returns(stubDecipher)
  };

  dbSetup.__set__({crypto: stubCrypto});

  // Act
  let results = dbSetup.__get__('decryptWithCypher')(stubStringToEncrypt, stubAlgorithm, mockPassword);

  // Assert
  t.equals(results, mockDecryptedString + mockDecryptedPostfix, 'the composed deciphered string should be returned');
  t.end();

});

test('getDBConnection called - pooled connection', function(t) {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let stubConnectionResult = {rows: 'mock resultset'};
  let stubConnection = {
    execute: sinon.stub().returns(Promise.resolve(stubConnectionResult))
  };
  let stubGetConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  let stubDatabase = {
    getConnection: sinon.stub().returns(stubConnection)
  };

  let getDbStub = sinon.stub().returns(stubDatabase);
  let getPoolStub = sinon.stub().returns(1);
  dbSetup.__set__({getPool: getPoolStub, getDb: getDbStub, getConnection: stubGetConnection});

  let getDBConnection = dbSetup.getDBConnection;

  // Act
  getDBConnection()
    .then(() => {
      t.equals(getDbStub.calledOnce, true, 'getDb called once');
      t.equals(getPoolStub.calledOnce, true, 'getPool called once');
      t.equals(stubDatabase.getConnection.calledOnce, true, 'getConnection called once');
      t.equals(stubConnection.execute.notCalled, true, 'execute is not called');
      t.end();
    }).catch((error) => {
    t.fail('This should not be accessed .catch block - ' + error);
    t.end();
  });
});

test('getDBConnection called - pooled connection - throws error', function(t) {

  // Arrange
  let expectedError = 'Connection error: undefined';
  let dbSetup = rewire('../db-setup');
  let stubConnectionResult = {rows: 'mock resultset'};
  let stubConnection = {
    execute: sinon.stub().returns(Promise.resolve(stubConnectionResult))
  };
  let stubGetConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  let stubDatabase = {
    getConnection: sinon.stub().returns(Promise.reject(stubConnection))
  };

  let getDbStub = sinon.stub().returns(stubDatabase);
  let getPoolStub = sinon.stub().returns(1);
  dbSetup.__set__({getPool: getPoolStub, getDb: getDbStub, getConnection: stubGetConnection});

  let getDBConnection = dbSetup.getDBConnection;

  // Act
  getDBConnection()
    .then((result) => {
      t.fail('This should not be accessed .catch block - ' + result);
      t.end();
    }).catch((error) => {
    t.equals(getDbStub.calledOnce, true, 'getDb called once');
    t.equals(getPoolStub.calledOnce, true, 'getPool called once');
    t.equals(stubDatabase.getConnection.calledOnce, true, 'getConnection called once');
    t.equals(stubConnection.execute.notCalled, true, 'execute is not called');
    t.equals(error.message, expectedError,'returned error should be equal to ' + expectedError);
    t.end();
  });
});

test('getDBConnection called - standalone', function(t) {

  // Arrange
  let dbSetup = rewire('../db-setup');
  let stubConnectionResult = {rows: 'mock resultset'};
  let stubConnection = {
    execute: sinon.stub().returns(Promise.resolve(stubConnectionResult))
  };
  let stubGetConnection = sinon.stub().returns(Promise.resolve(stubConnection));

  let stubDatabase = {
    getConnection: sinon.stub().returns(stubConnection)
  };

  let getDbStub = sinon.stub().returns(stubDatabase);
  let getPoolStub = sinon.stub().returns(null);
  dbSetup.__set__({getPool: getPoolStub, getDb: getDbStub, getConnection: stubGetConnection});

  let getDBConnection = dbSetup.getDBConnection;

  // Act
  getDBConnection()
    .then(() => {
      t.equals(getDbStub.calledOnce, true, 'getDb called once');
      t.equals(getPoolStub.calledOnce, true, 'getPool called once');
      t.equals(stubDatabase.getConnection.calledOnce, true, 'getConnection called once');
      t.equals(stubConnection.execute.calledOnce, true, 'execute called once');
      t.end();
    }).catch((error) => {
    t.fail('This should not be accessed .catch block - ' + error);
    t.end();
  });
});

test('executeOracleSelect doRelease should call connection.close without errors', (t) => {

  // Arrange
  let stubLogger = {error: sinon.stub()};
  let dbSetup = rewire('../db-setup');
  let mockConnection = {
    close: sinon.stub().yields()
  };

  dbSetup.__set__({
    logger: stubLogger
  });

  // Act
  dbSetup.__get__('doRelease')(mockConnection);

  // Assert
  t.equals(mockConnection.close.calledOnce, true, 'connection.close called once');
  t.equals(stubLogger.error.called, false, 'logger.error not called');
  t.end();

});

test('doRelease should call connection.close with error', (t) => {

  // Arrange
  let stubLogger = {error: sinon.stub()};
  let dbSetup = rewire('../db-setup');
  let mockConnection = {
    close: sinon.stub().yields(['error'])
  };

  dbSetup.__set__({
    logger: stubLogger
  });

  // Act
  dbSetup.__get__('doRelease')(mockConnection);

  // Assert
  t.equals(mockConnection.close.calledOnce, true, 'connection.close called once');
  t.equals(stubLogger.error.called, true, 'logger.error called');
  t.end();

});

test('initSession should call connection.execute', function(t) {

  // Arrange
  let dbSetup = rewire('../db-setup');
  const mockConnection = {
    execute: sinon.stub()
  };
  let mockDbConnectionSettings ={
    connectString: 'mock connect string',
    user: 'mock user',
    password: 'mock password',
    clientTimeZone: ' mockClientTimeZone'
  };

  dbSetup.__set__({
    config:{
      dbConnectionSettings:{
        clientTimeZone: mockDbConnectionSettings.clientTimeZone,
        connectString: mockDbConnectionSettings.connectString,
        user: mockDbConnectionSettings.user,
        password: mockDbConnectionSettings.password
      }
    }});

  // Act
  dbSetup.initSession(mockConnection, 'mock tag', 'mock callback');

  // Assert
  t.equal(mockConnection.execute.called, true, 'connection execute have been called');
  t.end();

});

