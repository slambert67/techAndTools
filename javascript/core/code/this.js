/*
Arrow functions
===============
do not have their own this.
Instead, they inherit this from the surrounding scope (lexical binding).


Regular Functions
=================
Regular functions get their this from how they are called, not where they are defined.

object method
-------------
const user = {
  name: "Tom",
  show() { console.log(this.name); }
};

user.show(); // "Tom"



Detached function (loses this)
------------------------------
const show = user.show;
show(); // undefined (or global object in non-strict mode)

Fixing it with .bind()
const bound = user.show.bind(user);
bound(); // "Tom"


In Classes
==========
this refers to the instance.
Methods automatically use the instance as their this.


In Event Listeners
==================



this with call/apply/bind
=========================
.call()         Occasional use. Calls the function immediately, with a custom this, passing arguments individually.
        function greet(a, b) {
        console.log(this.name, a, b);
        }

        greet.call({ name: "Alice" }, "hello", "world");
✔ this → { name: "Alice" }
✔ Arguments passed one by one
✔ Function executes right now


.apply()        Almost obsolete. Exactly like .call(), except arguments are passed as an array.
        greet.apply({ name: "Bob" }, ["hello", "again"]);
✔ this → { name: "Bob" }
✔ Arguments passed as an array
✔ Function executes right now


3. .bind()      Replaced by arrow functions. Does NOT call the function immediately. Instead, it returns a new function with this permanently locked in.
    const fn = greet.bind({ name: "Carol" }, "hello");
    fn("world"); // now it runs


Quick analogy
Imagine a function is a car and this is the driver.
    call → “Drive now with this driver.”
    apply → “Drive now with this driver, and here’s a list of passengers.”
    bind → “Create a new car that always has this driver, but drive later.”


4 binding rules
===============
Rule 1: Was the function called using new?
    new Person() → this = new instance

Rule 2: Was it called with bind/call/apply?
    fn.call(x) → this = x

Rule 3: Is it a method call?
    obj.method() → this = obj

Rule 4: Otherwise, default binding
    undefined in strict mode
    global object in non-strict mode (browser = window)


*/