/**
 rule 3 - explicit binding - specify owning object
 */
(function () {
    console.log("explicit binding - specify owning object");
    function foo() {
        console.log(this.myExp1);
    }
    var obj = {
        myExp1: 1
    };
    // force this = obj. Can still be paved over by a framework! ???
    foo.call(obj); // 1
})();
/**
 rule 3 - explicit hard binding
 */
(function () {
    console.log("explicit hard binding");
    function foo() {
        console.log(this.myExp2);
    }
    var obj = {
        myExp2: 2
    };
    var bar = function () {
        foo.call(obj); // foo's this now bound to obj.
    };
    bar(); // 2
    setTimeout(bar, 100); // 2
    // bar hard binds foo's this to obj so can't be overwritten
    //bar.call(window);  // 2
})();
/**
 rule 3 - explicit hard binding
 hard binding is such a common pattern that ES5 has an inbuilt utility
 Function.prototype.bind
 */
(function () {
    console.log("explicit hard binding - inbuilt utility");
    function foo(something) {
        console.log(this.myExp3, something);
        //return this.myExp3 + something;
    }
    var obj = {
        myExp3: 3
    };
    // bind returns a new function that is hard coded to call original function with 'this' context set as specified
    console.log("calling bind");
    var bar = foo.bind(obj);
    console.log("called bind");
    bar(4); // 4
    console.log("explicit hard binding - inbuilt utility");
})();
