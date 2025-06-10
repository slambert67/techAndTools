var module3Dependency = require("./module3Dependency");

exports.sum = function(a,b) {
    return module3Dependency.dependencySum(a,b);
}

exports.sum2 = function(a,b) {
    return module3Dependency.dependencySum2(a,b);
}