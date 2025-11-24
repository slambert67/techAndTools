const setAPI = ( () => {

    /*
        Key properties:
            Stores unique values
            Values can be any type (objects, arrays, NaN, etc.)
            Insertion order is preserved
            Faster membership checks than arrays (set.has(x))
    */


    function create() {

        // empty set
        const s1 = new Set();
        console.log('empty'); console.log(s1);


        // Create a Set from an array - automatically removes duplicates
        const s2 = new Set([1, 2, 2, 3]);
        console.log('from array'); console.log(s2);


        // Create from any iterable (string example)
        const s3 = new Set('hello');
        console.log('from string'); console.log(s3);


        // Create a Set from another Set
        const s4 = new Set([1,2,3]);
        const s5 = new Set(s4);
        console.log('from a set'); console.log(s5);


        // Create a set from a generator
        function* numbers() {
            yield 1;
            yield 2;
            yield 3;
        }
        const s6 = new Set(numbers());
        console.log('from a generator'); console.log(s6);


        // Create a Set from a Map’s keys/values
        const map = new Map([
            ["a", 1],
            ["b", 2]
        ]);

        const s7 = new Set(map.keys());
        const s8 = new Set(map.values());
        console.log('from a map'); console.log(s7); console.log(s8);
    }


    function modify() {
        // add
        const s1 = new Set([1, 2, 2, 3]);
        s1.add(4); console.log(s1);


        // delete
        s1.delete(2); console.log(s1);

        // has
        console.log(s1.has(5));

        // clear
        s1.clear(); console.log(s1);
    }


    function iterate() {
        const s1 = new Set([1, 2, 2, 3]);

        // for .. in - not valid as sets don't have keys. Or rather the keys are the values
        console.log('for in');
        for (const value in s1) console.log(value);

        // for .. of
        console.log('for of');
        for (const value of s1) console.log(value);

        // forEach
        console.log('forEach');
        s1.forEach(value => console.log(value));

        // keys
        console.log('keys');
        console.log(s1.keys());

        // values
        console.log('values');
        console.log(s1.values());   

        // entries
        console.log('entries');
        console.log(s1.entries());  
    }

    return {create, modify, iterate};
})();

//setAPI.create();
//setAPI.modify();
setAPI.iterate();