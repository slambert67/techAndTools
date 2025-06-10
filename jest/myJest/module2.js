var module2Dependency = require("./module2Dependency");

exports.sum = function(a,b) {
    return module2Dependency.dependencySum(a,b);
}
