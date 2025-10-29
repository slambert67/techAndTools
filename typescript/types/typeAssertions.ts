// override typescript's determination that an assignment is invalid

interface House {
    bedrooms: number;
    bathrooms: number;
}

interface Mansion {
    bedrooms: number;
    bathrooms: number;
    butlers: number;   
}

type HouseOrMansion = House | Mansion;

function getAbode(): HouseOrMansion {
    let x: HouseOrMansion = {
        bedrooms: 3,
        bathrooms:2,
        butlers: 1
    }

    return x;
}

const myAbode = getAbode();

// ok as properties are on both House and Mansion
const bedroomCount = myAbode.bedrooms;
const bathroomCount = myAbode.bathrooms;

// Not ok as butlers does not exist on both House and Mansion
// const butlerCount = myAbode.butlers;

// OK with type assertion
const butlerCount = (<Mansion>myAbode).butlers;




// see 'as' keyword. Trust me - I know this is a valid key
// return obj[key as keyof T];
// “Treat key as if it’s one of the valid keys of T”
// So that obj[key] becomes a valid, type-safe expression

// as is modern approach and preferred
// const butlerCount = (myAbode as Mansion).butlers;
