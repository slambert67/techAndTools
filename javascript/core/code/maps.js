/*
    A Map is a key–value data structure introduced in ES6 with these core characteristics:

    ✔ Keys can be any value
        Not just strings — but objects, arrays, functions, symbols, numbers, or primitives.

    ✔ Maintains insertion order
        Keys appear in the order you add them.

    ✔ Has a predictable and fast iteration API
        (Maps are designed to be iterated.)

    ✔ Avoids the limitations of plain objects
        (e.g., prototype keys, only strings/symbols allowed as keys, manual iteration)
*/

const mapAPI = ( () => {

    function create() {

        // empty map
        const m1 = new Map(); console.log('empty map'); console.log(m1);

        // from key, value arrays
        const m2 = new Map([
            ["name", "Alice"],
            ["age", 30]
        ]);
        console.log('from key values array'); console.log(m2);

        // incrementally
        const m3 = new Map();
        m3.set("color", "blue");
        m3.set(1, "one");
        const user = { id: 1 };
        m3.set(user, "UserObjectValue");
        const fn = () => {};
        m3.set(fn, "function value");
        console.log('incrementally'); console.log(m3);
    }


    function methods() {
        // set, get, has, clear, size   
    }


    function iteration() {
        /*
            for (const [key, value] of m) {
                console.log(key, value);
            }


            for (const key of m.keys()) {
                console.log(key);
            }


            for (const value of m.values()) {
                console.log(value);
            }

            m.forEach((value, key) => {
                console.log(key, value);
            });

        */
    }

    function conversion() {
        /*
            // map to array
            const arr = [...m];  // array of [key, value]

            // map to object
            Object.fromEntries(m);

            // object to map
            new Map(Object.entries(obj));


        */
    }


    // real life examples

    function lruCache() {

        /*
            least recently used cache - means the item that hasn’t been accessed for the longest time.
                When cache is full → remove the least recently used item.
                Every time an item is accessed → update its position.

            least recently used is first in map - as map is ordered
            delete and re-add adds to end
        */
    }



    return { create };

})();

mapAPI.create();