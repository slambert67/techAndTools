// define arrow function
let sum = (a, b) => a + b;
console.log( sum(1,2) );

/*
shorter version of
let sum = function(a, b) {
    return a + b;
} 
*/


// parentheses optional if 1 argument
let dbl = a => a * 2;
console.log( dbl(1) );


// multiline arrow function
// return statement needed
let sum2 = (a, b) => {
    let result = a + b;
    return result;
}
console.log( sum2(3,4) );


// arrow functions don't have a 'this'