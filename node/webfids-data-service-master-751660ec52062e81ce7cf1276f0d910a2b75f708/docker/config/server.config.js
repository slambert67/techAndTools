module.exports = {
  appPort: 80,
  SSL:{
      enable:false,
      /* trustedCertsInChain - a list of files under directory denoted by CA_STORE environment
       * variable that are required to mark "cert.pem" as trusted in https requests
       * */
      trustedCertsInChain : ['dev-ca.cer','ent-ca.cer','root-ca.cer']
  },
  tokenConfig: {
    enableTokenValidation: true
  },
  apiVersion: '1.0.0',
  loglevel: 'info', /* valid values are: fatal, error, warn, info, debug, trace [https://github.com/trentm/node-bunyan#levels]*/
  postLogsToLogService: true, /* if TRUE, the logs are written to both console and posted to the Log Service to be persisted in a file; if FALSE, just the console output is enabled */
 system: 'BRS'
};
