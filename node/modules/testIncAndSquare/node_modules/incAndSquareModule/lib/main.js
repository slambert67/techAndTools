var squareModule = require('squareModule');

exports.inc_and_square = function(x) {
    console.log("In inc_and_square");
    return squareModule.square(x + 1);
}
