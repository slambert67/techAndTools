var l3 = require('../../level3');

exports.printl2 = function() {
    console.log("In level 2");
    l3.printl3();
}

exports.addl2 = function(a,b) {
    const result = a+b;
    console.log(`addl2 returning ${result}`);
    return result;
}