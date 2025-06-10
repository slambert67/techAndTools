// require function returns interface exposed by module i.e. whatever is assigned to module.exports
// .js can be omitted but is bad practice
const hi = require('./sayHi.js');

hi('Steve');
console.log(__dirname);
console.log(__filename);