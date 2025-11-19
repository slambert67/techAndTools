/*
The destructuring assignment syntax is a JavaScript expression that makes it possible to unpack values from arrays,
or properties from objects, into distinct variables.
 */


// destructure array into individual variables. 'rest' becomes an array of remaining elements
/*const x = [1, 2, 3, 4, 5];
const [y, z, ...rest] = x;  // [] => destructure the array x
console.log(y); // 1
console.log(z); // 2
console.log(rest); // [3,4,5]*/


// Similarly, you can destructure objects on the left-hand side of the assignment.
/*const obj = { a: 1, b: 2 };
const { a, b } = obj;  // {} => destructure the object obj
console.log(a);  // 1
console.log(b);  // 2*/


/*
For both object and array destructuring, there are two kinds of destructuring patterns:
binding pattern and assignment pattern, with slightly different syntaxes.
 */

/*
BINDING PATTERN
In binding patterns, the pattern starts with a declaration keyword (var, let, or const).
Then, each individual property must either be bound to a variable or further destructured.
 */
/*const obj = { a: 1,
              b: { c: 2 } };
const { a, b: { c: d } } = obj;
// a gets the value of 1
// b gets value of {c:2} but is further destructured
// d gets value of c
console.log(a);  // 1
console.log(d);  // 2*/

/*
ASSIGNMENT PATTERN
Does not start with a keyword
 */
// populate numbers array with values from obj
const numbers = [];
const obj = { a: 6, b: 7 };
({ a: numbers[0], b: numbers[1] } = obj);
console.log(numbers);

