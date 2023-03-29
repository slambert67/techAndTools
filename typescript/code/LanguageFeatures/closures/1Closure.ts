// define a function that increments a counter in a loop

(function() {
    function closureExample() {

        var i = 0;

        for (i = 0; i< 3 ;i++) {
            setTimeout(function() {
                console.log('counter1 value is ' + i);  // 3,3,3 because i ir a reference!
            }, 1000);
        }

    }
// call the example function
    closureExample();
})();

(function() {
    function closureExample() {

        var i = 0;

        /*
        message log:
            - 'let' redeclares i for each loop iteration!
            - each function instance now closes over this block scope
         */

        for (let i = 0; i< 3 ;i++) {
            setTimeout(function() {
                console.log('counter2 value is ' + i);  // 0,1,2 because i ir a reference!
            }, 1000);
        }

    }
// call the example function
    closureExample();
})();
