// function is local to this module's scope
function sayHi(name) {
    console.log('Hello ' + name);
}

// module.exports used to define public API
// sayHi assigned to module.exports object
// module object provided by node
// module.exports contains the functions and data exposed as this module's API
// can just use exports as shorthand
// module object contains other fields - see node documentation
// e.g. --dirname, __filename
module.exports = sayHi;