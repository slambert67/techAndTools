/**
 rule 4 - new binding
 constructors are JUST FUNCTIONS that happen to be called with new operator
 Therefore, no such thing as constructor functions! Rather, construction calls of functions
 When function invoked with new:
 - brand new object created
 - newly constructed object is [[Prototype]] linked
 - this binding of function set to newly created object
 - automatically return newly created object
 */

function foo(myNew) {
    this.myNew = myNew;
}

var bar = new foo(1);
console.log(bar.myNew); // 1
