// union types
type Status = "loading" | "success" | "error";

type BooleanOrNumber = boolean | number;
const x: BooleanOrNumber = true;
console.log(x);

// const y: BooleanOrNumber = 'hello'; not allowed


type House = {
    bedrooms: number;
    bathrooms: number;
}

type Mansion = {
    bedrooms: number;
    bathrooms: number;
    butlers: number;   
}

type HouseOrMansion1 = House | Mansion;  

