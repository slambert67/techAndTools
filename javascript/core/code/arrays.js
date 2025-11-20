const api = ( () => {

    /*
        Array() instances are just Object() instances with extra functions and a built-in numeric index
    */

    function creating() {

        // constructor - almost never used
        let arr1 = new Array('foo', 'bar');
        console.log(arr1);


        // literal notation
        let arr2 = ['bar', 'foo'];
        console.log(arr2); 


        // dynamically
        // create array from individual values. could be from ...rest
        let arr3 = Array.of('foo', 'bar');
        console.log(arr3);


        // from an iterable - string
        let arr4 = Array.from('hello world');
        console.log(arr4);


        // from an iterable - array
        let arr5 = ['foo', 'bar'];
        let arr6 = Array.from(arr5);
        console.log(arr6);


        // from an iterable - array with mapping
        let arr7 = ['foo', 'bar'];
        let arr8 = Array.from(arr7, x => x + x);
        console.log(arr8);


        // multidimensional
        const arr9 = [
            ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],       // 0,0 -> 0,7
            ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],       // 1,0 -> 1,7
            ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
            ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5']
        ];

        console.log(arr9[1][7]);
    }



    function checking_searching() {
        const arr = [10, 20, 30, 20, 40];

        // indexOf() - Finds the first occurrence of a value → returns its index, or -1 if not found.
        console.log(arr.indexOf(20));   // 1
        console.log(arr.indexOf(50));   // -1


        // lastIndexOf() - Finds the last occurrence of a value.
        console.log(arr.lastIndexOf(20));  // 3)


        // includes() - Checks whether a value exists → returns true/false.
        console.log(arr.includes(20));


        // find() - Returns the first element that matches a condition (function).
        console.log(arr.find(x => x > 25));  // 30  (first value greater than 25)


        // findIndex() - Returns the index of the first matching element.
        console.log(arr.findIndex(x => x > 25));    // 2  (since arr[2] is 30)  -1 if not found


        // findLast() - Like find(), but starts searching from the end.
        console.log(arr.findLast(x => x > 15));     // // 40  (last value greater than 15)


        // findLastIndex() - Like findIndex(), but returns the last index where the condition is true.
        console.log(arr.findLastIndex(x => x < 35));    // 3  (arr[3] = 20 is the last match)


        // some() - Returns true if at least one element matches.
        console.log(arr.some(x => x === 30));


        // every() - Returns true only if ALL elements match.
        console.log(arr.every(x => x > 5));
    }


    function accessing() {
        const arr = ["a", "b", "c"];

        // at() - Returns the element at a given index. Supports negative indices (very useful).
        console.log(arr.at(0));     // a
        console.log(arr.at(-1));    // c


        // entries() - Returns an iterator of [index, value] pairs.
        for (const [index, value] of arr.entries()) {
            console.log(index, value);
        }

        const it = arr.entries();
        console.log(it.next());     // { value: [0, "a"], done: false }
        console.log(it.next());     // { value: [1, "b"], done: false }
        console.log(it.next());     // { value: [2, "c"], done: false }
        console.log(it.next());     // { value: undefined, done: true }


        // keys() - Returns an iterator of the array’s indices. c.f. Object.keys()
        for (const key of arr.keys()) {
            console.log(key);
        }


        // values() - Returns an iterator of the array’s values.
        for (const value of arr.values()) {
            console.log(value);
        }

        // because arrays are iterable by default we use this:
        for (const value of arr) console.log(value);
    }


    function iteration() {
        // for...of loops loop over values
        // for...in loops loop over keys - or indexes for arrays

        const nums = [1, 2, 3, 4];

        // best general purpose - no access to index
        for (let entry of nums) {
            let entryType = typeof(entry);
            console.log(`for...of - ${entry} - ${entryType}`);
        }

        // forEach() - Runs a function for each element. Does NOT return a new array. Cannot break or return
        nums.forEach(n => {
            console.log(n * 2);
        });


        // map() - Transforms each element into something new. Returns a new array.
        const doubled = nums.map(n => n * 2);
        console.log(doubled);


        // filter() - Keeps only elements that match a condition. Returns a new array.
        const evens = nums.filter(n => n % 2 === 0);
        console.log(evens);


        // reduce() -   Reduces the array into one single value by accumulating.
        //              In the examples below the 0 and '' are the initial value

            // e.g. sum all numbers
            const sum = nums.reduce((total, n) => total + n, 0);
            console.log(sum);

            // e.g. build a string
            const joined = nums.reduce((acc, n) => acc + n, "");
            console.log(joined);


        // reduceRight() - Accumulates starting at the end

            // e.g. sum all numbers
            const sum2 = nums.reduceRight((total, n) => total + n, 0);
            console.log(sum2);

            // e.g. build a string
            const joined2 = nums.reduceRight((acc, n) => acc + n, "");
            console.log(joined2);
    }


    function add_remove_mutate() {      // change the original array

        let nums = [1, 2, 3, 4];

        // push() – adds elements to the end
        nums.push(5);
        console.log(nums);

        // pop() – removes the last element
        nums.pop();
        console.log(nums);

        // unshift() – adds elements to the start
        nums.unshift(0);
        console.log(nums);

        // shift() – removes the first element
        nums.shift();
        console.log(nums);

        // splice() – add/remove elements at any position
        // array.splice(startIndex, deleteCount, ...itemsToInsert)
        nums.splice(1,2,'a','b');
        console.log(nums);

        // fill() – fill array with same value
        // fill(value, start = 0, end = array.length)
        nums.fill('x');
        console.log(nums);
    }


    function add_remove_non_mutate() {      // do not change the original array
        const arr = [1, 2, 3, 4, 5];

        // toSpliced() — immutable version of splice()
        const newArr = arr.toSpliced(1, 2, 8, 9);
        console.log(arr);     // [1, 2, 3, 4, 5]  (unchanged)
        console.log(newArr);  // [1, 8, 9, 4, 5]

        // with() — replace an element immutably
        const replaced = arr.with(2, 99);
        console.log(arr);      // [1, 2, 3, 4, 5]  (unchanged)
        console.log(replaced); // [1, 2, 99, 4, 5]
    }


    function sorting() {

        // sort() — sorts array in place (mutates)
        let arr1 = [4, 3, 2, 1];
        console.log(arr1.sort());

        // with compare function
        arr1 = [4,3,2,1];
        console.log( arr1.sort( (a,b) => a-b) );


        // reverse() — reverses array in place (mutates)
        const arr2 = [4, 3, 2, 1];
        console.log(arr2.reverse());


        // toSorted() — immutable version of sort()
        const arr3 = [3, 1, 4, 2];
        const sorted = arr3.toSorted();
        console.log(arr3);    // [3, 1, 4, 2]
        console.log(sorted); // [1, 2, 3, 4]


        // toReversed() — immutable version of reverse()
        const arr4 = [1, 2, 3, 4];
        const reversed = arr4.toReversed();
        console.log(arr4);      // [1, 2, 3, 4]
        console.log(reversed); // [4, 3, 2, 1]

    }


    function transform() {      // all non mutating

        let arr = [1, 2, 3, 4];

        // map() - Transforms each element and returns a new array (non-mutating).
        const result = arr.map(n => n * 2);
        console.log(result); // [2, 4, 6, 8]


        // flat() - Flattens nested arrays.
        const nested = [1, [2, 3], [4]];
        console.log(nested.flat());             // equivalent to flat(1) where 1 is depth
        const nested2 = [[[[[[1, [2,3]]]]]]];
        console.log(nested.flat(Infinity)); ;


        // flatMap() - Runs a map → then does a flat(1). Very common for splitting or expanding values.
        // e.g. splitting words
        console.log('flatMap');
        const words = ["hello world", "foo bar"];
        const result2 = words.flatMap(w => w.split(" "));
        const result3 = words.map(w => w.split(" "));
        console.log(result2); // [1, 2, 3, 4] -> [1, 2, 2, 4, 3, 6, 4, 8]
        console.log(result3); 


        // slice() - Extracts part of an array without modifying it.
        console.log('slice');
        console.log(arr.slice(1, 3));   // Extract from index 1 to 3 (3 excluded)
        console.log(arr.slice(-2));


        // concat() - Joins two or more arrays. Does NOT mutate original arrays.
        console.log('concat');
        const a = [1, 2];
        const b = [3, 4];
        const result4 = a.concat(b);
        console.log(result4); // [1, 2, 3, 4]

        const result5 = arr.concat(5, 6);
        console.log(result5); // [1, 2, 3, 4, 5, 6]


        // toString(    )
        const arr2 = [1, 2, 3];
        console.log(arr2.toString()); // "1,2,3"

        // toLocaleString()
        const ar3 = [1000, 2000, 3000];
        console.log(arr3.toLocaleString("en-US")); // "1,000,2,000,3,000"
        console.log(arr3.toLocaleString("de-DE")); // "1.000,2.000,3.000"
    }


    function iterables() {
        /*
        ITERATORS (RETURN ITERABLES)

entries()

keys()

values()
        */
    }

    return { creating, checking_searching, accessing, iteration, add_remove_mutate, add_remove_non_mutate, sorting, transform };
})();

//api.creating();
//api.checking_searching();
//api.accessing();
//api.iteration();
//api.add_remove_mutate();
//api.add_remove_non_mutate();
//api.sorting();
api.transform();