let myMath = require('./myMath');

exports.doAdd = function(a,b) {
    return myMath.add(a, b);
}

exports.doSubtract = function(a,b) {
    return myMath.subtract(a, b);
}