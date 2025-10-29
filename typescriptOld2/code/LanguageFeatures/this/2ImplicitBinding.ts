var myImp;
global.myImp=1;

(function() {
    /**
     rule 2 - implicit binding
     does the call-site have a context object (owning or containing object)
     foo declared and then added as a reference property onto obj
     */
    console.log("rule 2 - implicit binding");
    function foo() {
        // this set to obj at invokation
        console.log(this.myImp);
    }

    // foo contained within obj so this set to obj on invokation
    var obj = {
        myImp:2,
        foo2:foo
    };
    // obj context used to reference function. Therefore 'this' = obj at invokation
    // only last in property chain is relevant: obja.objb.objc.foo(). 'this' = objc

    obj.foo2();  // 2
})();

///////////////////////////

(function() {
    /**
     rule 2 - implicit binding lost - function reference
     falls back on default binding - global or undefined(strict)
     */
    console.log("rule 2 - implicit binding lost - function reference");
    function foo() {
        console.log(this.myImp);
    }

    var obj = {
        myImp:3,
        foo: foo
    }

    // bar appears to be reference to obj.foo. Actually it's just a reference to foo
    global.myImp = "oops, global2";

    var bar = obj.foo;
    bar();  // oops global
})();

//////////////////

(function() {
    /**
     rule 2 - implicit binding lost - callback1
     */
    console.log("rule 2 - implicit binding lost - callback");
    function foo() {
        console.log(this.myImp);
    }

    function doFoo(fn) {
        // fn is just another reference to foo
        // parameter passing is just an implicit assignment
        fn();  // <- call-site
    }

    var obj = {
        myImp:2,
        foo: foo
    }

    global.myImp = "oops, global3";
    doFoo(obj.foo);  // oops global
})();
