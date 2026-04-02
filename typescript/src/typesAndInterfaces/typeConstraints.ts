// used to limit the types generics operate on
// you can give me any type but it must have at least these properties or extend this base type
// they let you use generic flexibility without losing type safety.
// Quick mental model
//   “Type constraints let you tell TypeScript:
//   ‘I don’t know what T is yet, but it must at least look like this.’”


// example with no constraint. No restriction on T
function identity<T>(value: T): T {
  return value;
}


// adding a constraint with extends
// assume we only want to accept types that have a length property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}


// constraints to classes or interfaces
interface Animal {
  name: string;
}

function greet<T extends Animal>(animal: T) {
  console.log(`Hello, ${animal.name}!`);
}

greet({ name: "Dog" }); // ✅ works
// greet({ title: "Car" }); // ❌ error — no 'name'


// You can limit a generic to built-in types too:
function combine<T extends string | number>(a: T, b: T): string {
  return `${a}${b}`;
}

combine(1, 2);       // ✅ ok
combine("a", "b");   // ✅ ok
// combine(true, false); // ❌ boolean not allowed


function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const userxx = { id: 1, name: 'Steve' };
const result = getProp(user, 'name'); // type should be string

