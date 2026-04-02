type BooleanOrNumber = boolean | number;
const x: BooleanOrNumber = true;
console.log(x);

// const y: BooleanOrNumber = 'hello'; not allowed


interface House {
    bedrooms: number;
    bathrooms: number;
}

interface Mansion {
    bedrooms: number;
    bathrooms: number;
    butlers: number;   
}

type HouseOrMansion1 = House | Mansion;  //  type can be based on interfaces
