// T is a type parameter. It acts like a variable, but for types. Whatever type goes in comes back out
function identity<T>(value: T): T {
  return value;
}
const a = identity<string>("hello");
const b = identity(42); // type inferred as number
// Key idea: TypeScript infers T from usage whenever possible.



// Multiple Type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}
const result = pair("age", 30);
// inferred as [string, number]



// Arrays
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([1, 2, 3]);      // number | undefined
const s = first(["a", "b"]);    // string | undefined



// Defaults can be provided
// Meaning: If you don’t specify T, TypeScript uses unknown. If you do specify T, it overrides the default
// unknown preserves type safety. any destroys it
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const c: ApiResponse = {
  data: null,
  status: 200
};

const d: ApiResponse<string> = {
  data: "ok",
  status: 200
};



