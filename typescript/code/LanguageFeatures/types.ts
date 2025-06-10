// primitive type annotation
const myName: string = 'Steve';
const dob: number = 1967;
const isActive: boolean = false;

// array type annotation
const family: string[] = ['Mum', 'Julie', 'Andy'];

// object type annotation
let person: { name: string; dob: number };
person = { name: 'Steve', dob: 1967};

// if type is complex can create interface or type alias

// interface
interface PersonInterface {
    name: string;
    dob: number;
};
const steve: PersonInterface = {
    name: 'Steve',
    dob: 1967
};

// type alias
type PersonType = {
    name: string;
    dob: number;
};
const julie: PersonType = {
    name: 'Julie',
    dob: 1970
};

// special types
////////////////
// undefined is value of variable that has not been assigned a value
// null is intentional absence of a value i.e. failed to find
// void indicates a function does not return a value
// never represents unreachable code. Function throwing exception has return type of never





