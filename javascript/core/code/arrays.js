const api = ( () => {

    /*
        Array() instances are just Object() instances with extra functions and a built-in numeric index
    */

    function declaring() {
        let arr1 = new Array('foo', 'bar');     // almost never used
        let arr2 = new Array(3);                // single integer specifies length
        let arr3 = ['bar', 'foo'];              // array literal notation
        let arr4 = Array.of('foo', 'bar');      // newer ?
        console.log(arr1);
        console.log(arr2);
        console.log(arr3); 
        console.log(arr4);
    }


    function arrayFrom() {
        // Create an array from an iterable or array-like object.
        // strings, sets, maps 
        
        // create array from string
        let arr1 = Array.from('hello world');
        console.log(arr1);

        // create array from array
        let arr2 = ['foo', 'bar'];
        let arr3 = Array.from(arr2);
        console.log(arr3);

        // create array from array with mapping
        let arr4 = ['foo', 'bar'];
        let arr5 = Array.from(arr4, x => x + x);
        console.log(arr5);
    }


    function manualUpdates() {
        let arr1 = [];
        arr1[50] = 'foo';
        console.log(arr1.length);   // 51. 0-49 populated with undefined
    }


    function looping() {

        // a for...in loop always enumerates the keys. Object property keys are always strings - even array indexes!
        // for...of loops loop over values
        // for...in loops loop over keys

        // avoid for arrays
        let arr1 = ['foo', 'bar'];
        for ( let entry in arr1) {
            let entryType = typeof(entry);
            console.log(`for...in - ${entry} - ${entryType}`);     // 0,1 as strings
        }

        // best general purpose - no access to index
        let arr2 = ['foo', 'bar'];
        for (let entry of arr2) {
            let entryType = typeof(entry);
            console.log(`for...of - ${entry} - ${entryType}`);
        }

        // Best for array processing without early exit - cannot break or return
        let arr3 = ['foo', 'bar'];
        arr3.forEach( (value, index) => {
            console.log(`forEach - ${index} - ${value}`);
        });
    }


    function iteration() {

    }

    
    function twoD() {
        const arr1 = [
            ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],       // 0,0 -> 0,7
            ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],       // 1,0 -> 1,7
            ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
            ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5']
        ];

        console.log(arr1[1][7]);
    }
    return { declaring, arrayFrom, manualUpdates, looping, twoD };
})();

//api.declaring();
api.arrayFrom();
//api.manualUpdates();
//api.looping();
//api.twoD();