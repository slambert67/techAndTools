// This is JavaScript’s Map, with TypeScript adding type safety.

/*
    Why use Map instead of an object?
    Keys can be any type (objects, functions, etc.)
    Preserves insertion order
    No prototype collisions (__proto__)
    Explicit size (map.size)
*/

const userAges = new Map<string, number>();

userAges.set("alice", 30);
userAges.set("bob", 25);

const age = userAges.get("alice"); // number | undefined


for (const [key, value] of userAges) {
  console.log(key, value);
}
