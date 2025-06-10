/*
A 'this' binding is made for each function invokation
- based on where function is invoked as opposed to lexical scope

 */
// declare global variable
var myDef;
global.myDef = 1;
function foo() {
    // examine call-site to see how foo is called
    console.log(this.myDef);
}
// foo called with default binding. 'this' points to global object
// global object not available for default binding in strict mode
foo(); // 1
function bar() {
    var myDef = 2;
    foo();
}
bar();
