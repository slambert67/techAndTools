// arrays
type Numbers = number[];
const values: Array<number> = [1, 2, 3];



(() => {
    interface Name {
        name: string;
    }

    // declaration
    const names1: Name[] = [];
    const name2: Array<Name> = [];


    // add to end of array
    names1.push( {name: "steve"} );
    names1.push( {name: "julie"} );
    names1.push( {name: "andy"} );
    names1.push( {name: "tmp"} );
    console.log( names1 );


    // remove from end of array
    names1.pop();
    console.log( names1 );


    // find first element matching a condition
    let found = names1.find( n => n.name === "andy");
    console.log(found);


    // Returns the index of the first matching element.
    let index = names1.findIndex( n => n.name === "andy");
    console.log(index);


    // Checks if an element exists in the array. ONLY WORKS WITH PRIMITIVES
    const nums: number[] = [1,2,3];
    const numfound = nums.includes( 1 );
    console.log(numfound);
})();










