/**
 * handling errors within asynchronous code
 * ========================================
 * callback always has:
 * - param1: err - the success or failure status of last operation
 *                 null indicates success else
 *                 instance of Error object class
 * - param2: results - eg, file handle, db connection, rows from query etc
 */

var fs = require('fs');

fs.open(
    'info.txt', 'r',
    function (err, handle) {
        if (err) {
            console.log("ERROR: " + err.code + " : " + err.message);
        } else {
            console.log("SUCCESS");
        }
    }
);