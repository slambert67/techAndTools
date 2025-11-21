const equalityAPI = ( () => {

    function strictEquality() {
        // === compares value and type. to type coercion

        console.log(`null equals null - ` + (null === null));
        console.log(`undefined equals undefined - ` + (undefined === undefined));
        console.log(`NaN equals NaN - ` + (NaN === NaN));

        /*
        Key points:
            NaN === NaN → false
            null and undefined are only strictly equal to themselves
        */
    }


    function looseEquality() {
        // == Performs type coercion before comparison

        console.log(1 == '1');              // true - string coerced to number
        console.log(0 == false);            // true
        console.log(1 == true);             // true
        console.log(null == undefined);     // true
        console.log(null == 0);             // false
        console.log(undefined == 0);        // false
        console.log(NaN == NaN);            // false - Nan is never equal to itself
    }

    return { strictEquality, looseEquality };
}

)();

//equalityAPI.strictEquality();
equalityAPI.looseEquality();



// rxjs library