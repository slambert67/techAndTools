module.exports = {
  appPort: 8201,
  SSL:{
    enable:false,
   /* trustedCertsInChain - a list of certificates that are required to mark self signed certificates as trusted in https requests. If using a trusted cert then leave empty
    * certificateLocation - location of certificates. If not set CA_STORE env var will be used */
    trustedCertsInChain : ['dev-ca.cer','ent-ca.cer','root-ca.cer'],
    certificateLocation: '/etc/ssl/rhel7.kickstart.local',
    certificate : 'cert.pem',
    privateKey : 'key.pem',
    passphrase : ''
  },
  tokenConfig: {
    enableTokenValidation: false
  },
  apiVersion: '1.0.0',
  loglevel: 'info', /* valid values are: fatal, error, warn, info, debug, trace [https://github.com/trentm/node-bunyan#levels]*/
  postLogsToLogService: false, /* if TRUE, the logs are written to both console and posted to the Log Service to be persisted in a file; if FALSE, just the console output is enabled */
  dbConnectionSettings: {
    type: 'ORACLE',
    user: '3278cdc050a99011335e1e229ed920e2',
    password: '08f4e88d711279ce2bf1c1a46c4d61388231a6a5f8fe2d226d991a1d86e6be24',
    connectString: '//10.172.253.23/aims',
    useConnectionPooling: true,
    /*oracledb driver converts DATEs to TIMESTAMPs but as DATEs dont contain timezones
      it assumes the TIMESTAMPs TIMEZONE is the session timezone and this can change the times
      returned form the database. To avoid this conversion set the session timezone to the db
      timezone*/
    clientTimeZone: 'alter session set TIME_ZONE = DBTIMEZONE'
  },
  system: 'WEBFIDS'
};
