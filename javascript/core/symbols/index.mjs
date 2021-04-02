/**
 * Symbol - new primitive type
 * Immutable like numbers and strings
 * Symbols are often used to add unique property keys to an object that won’t collide with keys any other code might add to the object, 
 * and which are hidden from any mechanisms other code will typically use to access the object -useful for information hiding
 * Object.getOwnPropertySymbols reveals them
 * Every Symbol() call is guaranteed to return a unique Symbol
 * Every Symbol.for("key") call will always return the same Symbol for a given value of "key"
 * When Symbol.for("key") is called, if a Symbol with the given key can be found in the global Symbol registry, that Symbol is returned
 * Otherwise, a new Symbol is created, added to the global Symbol registry under the given key, and returned.
 * ES6 symbols are values, but they’re not strings. They’re not objects. They’re something new: a seventh type of value.
 */

 // To create a new primitive Symbol, you write Symbol() with an optional string as its description:

// create 3 unique symbols
let sym1 = Symbol();
let sym2 = Symbol('foo'); // optional string as description
let sym3 = Symbol('foo');

// scope
// Symbol() function will not create a global Symbol that is available in your whole codebase
// use the methods Symbol.for() and Symbol.keyFor() to set and retrieve Symbols from the global Symbol registry


// There are three ways to obtain a symbol.
// Call Symbol(). As we already discussed, this returns a new unique symbol each time it’s called.

/**
 * There are three ways to obtain a symbol.
 * 
 * Call Symbol(). As we already discussed, this returns a new unique symbol each time it’s called.
 * 
 * Call Symbol.for(string). This accesses a set of existing symbols called the symbol registry. 
 * Unlike the unique symbols defined by Symbol(), symbols in the symbol registry are shared. 
 * If you call Symbol.for("cat") thirty times, it will return the same symbol each time. 
 * The registry is useful when multiple web pages, or multiple modules within the same web page, need to share a symbol.
 * 
 * Use symbols like Symbol.iterator, defined by the standard. A few symbols are defined by the standard itself. Each one has its own special purpose.
 */
let obj = new Object();
let mySymbol = Symbol();
obj[mySymbol] = "ok!";  // guaranteed not to collide. symbol keyed property
console.log(obj[mySymbol]);  // ok!


