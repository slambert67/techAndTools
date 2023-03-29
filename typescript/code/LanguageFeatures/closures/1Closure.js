// define a function that increments a counter in a loop
(function () {
    function closureExample() {
        var i = 0;
        for (i = 0; i < 3; i++) {
            setTimeout(function () {
                console.log('counter1 value is ' + i); // 3,3,3 because i ir a reference!
            }, 1000);
        }
    }
    // call the example function
    closureExample();
})();
(function () {
    function closureExample() {
        var i = 0;
        var _loop_1 = function (i_1) {
            setTimeout(function () {
                console.log('counter2 value is ' + i_1); // 3,3,3 because i ir a reference!
            }, 1000);
        };
        for (var i_1 = 0; i_1 < 3; i_1++) {
            _loop_1(i_1);
        }
    }
    // call the example function
    closureExample();
})();
