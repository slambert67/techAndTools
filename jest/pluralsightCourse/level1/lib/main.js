var l2 = require('../../level2');

exports.printl1 = function() {
    console.log("In level 1");
    l2.printl2();
}

exports.jestFunc1 = function(a,b) {
    return a + b;
}

exports.jestError = function() {
    throw new Error('squoink');
}

exports.addl1 = function(a,b,dummyFunc) {
    dummyFunc();
    return l2.addl2(a,b);
}

exports.addl1 = function(x) {
    x();
    return 1;
}

exports.dependent = function(y) {
    return y();
}

exports.addxxx = function(xFunc) {
    xFunc(3);
    xFunc(4);
    return 1;
}
