/*
The spread operator makes deep copies of data if the data is not nested.
 */

// Spread syntax with arrays to function invocations
/*function fun (aParam, bParam, cParam, dParam) {
    console.log(aParam); // 'a'
    console.log(bParam); // 'b'
    console.log(cParam); // 'c'
    console.log(dParam); // 'd'
}
const arr = [ 'b', 'c' ];
fun('a', ...arr, 'd' );
// a,b,c,d*/


// Spread syntax with arrays to other arrays
/*const arr1 = [ 'b', 'c' ];
const arr2 = [ 'e', 'f' ];
const combinedArr = [ 'a', ...arr1, 'd', ...arr2, 'g' ];
console.log(combinedArr); // [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];*/


// Spread syntax with objects to other objects
/*const obj1 = { a: 1, b: 1, f: 1 };
const obj2 = { c: 2, d: 2, f: 2 };
const obj3 = { e: 3, f: 3 };
const combinedObj = {
    a: 0,
    ...obj1,
    b: 0,
    c: 0,
    ...obj2,
    d: 0,
    e: 0,
    ...obj3,
    f: 0
};
console.log(combinedObj);*/
/*{a: 1,b: 0,c: 2,d: 0,e: 3,f: 0}*/


// Spread array to object
/*const arr = [ 'a', 'b', 'c' ];
const obj = { ...arr };
console.log(obj);*/
// { 0: 'a', 1: 'b', 2: 'c' }


// Spread array to array
/*const originalArr = [ 'a', 'b', 'c' ];
const arrayShallowCopy = [ ...originalArr ];
arrayShallowCopy[1] = 'overrideShallowCopyValueOnly';
console.log(originalArr);  // unchanged
console.log(arrayShallowCopy);*/


// gotchas
// Objects cannot spread to function invocations
// Objects cannot spread to arrays
