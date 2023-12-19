var externalDependency = require("./module1Dependency");


myPrivateSum = function(a,b) {
    return a+b;
}

exports.sum = function(a,b) {
    return myPrivateSum(a,b);
}

exports.sum2 = function(a,b) {
    return externalDependency.dependencySum(a,b);
}