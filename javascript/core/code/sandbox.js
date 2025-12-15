const sandboxAPI = ( () => {

    /*
        A higher-order function is ANY function that does one or both of these:

            Takes a function as an argument OR
            Returns a new function
    */



    ////////////////////////////////////////////////////////////////////////////////
    // only take a function as an argument
    ////////////////////////////////////////////////////////////////////////////////
    console.log('Only take a function as an argument');
    console.log('***********************************');
    function applyToNumber5( fn ) {

        // not returning a function!!!
        // returning result of calling fn(5) !!!
        return fn(5);
    }

    const double = (x) => x * 2;
    const thinkOfANumber = (x) => 'you thought of ' + x;

    console.log( double(3) );
    console.log( applyToNumber5( double ) );

    console.log( thinkOfANumber(7) );
    console.log( applyToNumber5( thinkOfANumber ) );



    ////////////////////////////////////////////////////////////////////////////////
    // this only returns a function
    ////////////////////////////////////////////////////////////////////////////////
    console.log('Only return a function');
    console.log('**********************');
    function sayHello() {
        return function() {
            console.log('hello');
        }
    }

    sayHello()();



    ////////////////////////////////////////////////////////////////////////////////
    // return a function that calls the original function (no args)
    ////////////////////////////////////////////////////////////////////////////////
    console.log('return a function that calls the original function (no args)');
    console.log('************************************************************');
    function higherOrderFn( fn ) {

        return function() {
            console.log('Calling function without arguments');
            return fn();        // call fn and return result
        }
    }

    function sayGoodbye() {
        console.log('Goodbye');
    }

    higherOrderFn( sayGoodbye )();
    

    ////////////////////////////////////////////////////////////////////////////////
    // return a function that calls the original function with args
    ////////////////////////////////////////////////////////////////////////////////
    console.log('return a function that calls the original function with args');
    console.log('************************************************************');
    function higherOrderFn2( fn ) {

        return function(...args) {
            // function parameters are not free variables so lexical scope doesn't apply
            // they are local bindings, created per function
            // The inner function is lexically nested, but its parameters are NOT lexically inherited; they are fresh bindings created every time the inner function is called

            console.log('calling function with arguments:', ...args);

            return fn.apply(null, args);
        }
    }

    function saySomething( ...args ) {
        console.log( ...args );
    }

    higherOrderFn2( saySomething ) ( 'oink', 'boink' );

  
    
    ////////////////////////////////////////////////////////////////////////////////
    // return a function that calls the original function with args and this
    ////////////////////////////////////////////////////////////////////////////////
    console.log('return a function that calls the original function with args and this');
    console.log('*********************************************************************');
    function higherOrderFn3( fn ) {

        return function(...args) {
            console.log('Called via ho function');
            console.log('THIS');
            //console.log(this);
            return fn.apply(this, args);
        }
    }

    myObj1 = {
        name: 'Steve',
        greet( greeting ) {
            console.log(`${greeting} ${this.name}`);
        }
    }
    myObj2 = {
        name: 'Andy',
        greet( greeting ) {
            console.log(`${greeting} ${this.name}`);
        }
    }

    // doesn't work - passing the function without it's object context
    higherOrderFn3(myObj1.greet)('hello');

    // fix1 - Bind the method before passing it
    higherOrderFn3(myObj1.greet.bind(myObj1))('hello');

    // fix2 - pass original obj and use this in the code: fn.apply(obj, args);

    // fix3 - 
    myObj1.greet = higherOrderFn3(myObj1.greet);
    myObj1.greet('hello');


})();



