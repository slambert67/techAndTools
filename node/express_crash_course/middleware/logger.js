const moment = require('moment');

const logger = (req, res, next) => {  // next calls next function in middleware stack?
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()}`);
    next();
}

module.exports = logger;