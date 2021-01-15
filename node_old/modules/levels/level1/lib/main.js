var l2 = require('../../level2');

exports.printl1 = function() {
    console.log("In level 1");
    l2.printl2();
}