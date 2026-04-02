// generic functions

function identity<T>(arg: T): T {       // <T> gives us a handle on the parameter type
    return arg;
}
console.log( identity<number>(1) );         // <number> and <boolean> not necessary due to type inference
console.log( identity<boolean>(true) );



function genericArray<T>(arg: T[]): T[] {
    console.log( arg.length );
    return [];
}
genericArray( [1,2,3] );


// generic function signature
let myIdentity: <T2>(arg: T2) => T2;
// needs an assignment
myIdentity = identity;
console.log( myIdentity('abc') );

// why bother? Useful as signature can be used to define higher order functions!
type myIdentity2 = <T2>(arg: T2) => T2;     // define type alias
function higherOrderIdentity( myFunc: myIdentity2 ) {
    console.log( myFunc(123) );
}
higherOrderIdentity( identity );


// generic constraints

// does not work because not all types have a length property!
/*function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}*/
// As long as the type has this member, we’ll allow it, but it’s required to have at least this member. To do so, we must list our requirement as a constraint on what Type can be.
interface Lengthwise {
  length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
// loggingIdentity(3);  fails as 3 does not have a length property
loggingIdentity({ length: 10, value: 3 });




// keyof - takes an object type and produces a string or numeric literal union of its keys
console.log('keyof');
type Point = { x: number; y: number };
type P = keyof Point;   // equivalent to 'x' | 'y'
let p1: P = 'x';
console.log(p1);



// Practical stuff

// Generic Functions (FOUNDATIONAL)
function identity2<T>(value: T): T {
  return value;
}

// Generic Function Types / Signatures
type Mapper = <T>(value: T) => T;

// Generic Interfaces
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Generic Classes
class Box<T> {
  constructor(public value: T) {}
}





// Multiple Type Parameters
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

// Default Generic Parameters
interface Result<T = string> {
  value: T;
}


// Generic Type Aliases
type Nullable<T> = T | null;


// keyof with Generics
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}


// Generic Constraints (extends)
function logLength<T extends { length: number }>(x: T) {
  console.log(x.length);
}


// Generic Constraints Using keyof
function pick<T, K extends readonly (keyof T)[]>(obj: T, keys: K) {
  return keys.map(k => obj[k]);
}

