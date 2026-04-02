// create variations of existing types in a single expression
interface Options {
    material: string;
    backlight: boolean;
}


// Mapped Types
// keyof - index type query
type ReadOnly<T> = { readonly [k in keyof T]: T[k]; };
type Optional<T> = { [k in keyof T]?: T[k] };
type Nullable<T> = { [k in keyof T]: T[k] | null};


// creating new types from mapped types
type ReadOnlyOptions = ReadOnly<Options>;
type OptionalOptions = Optional<Options>;
type NullableOptions = Nullable<Options>;


// using mapped types
const options1: ReadOnlyOptions = {
    backlight: true,
    material: 'plastic'
}

// options1.backlight = false;   Invalid because read only

const options2: OptionalOptions = {
    // All members are optional
}


const options3: NullableOptions = {
    backlight: null,
    material: null
}

