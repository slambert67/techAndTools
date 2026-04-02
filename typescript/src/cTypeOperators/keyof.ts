// keyof is a type operator in TypeScript that produces a union of property names of a given type.
// Give me all the valid keys of this type

/*
It lets you:
    Constrain property access
    Write type-safe generic utilities
    Reflect object structure at the type level
    Avoid stringly-typed code
*/
type User = {
  id: string;
  name: string;
  isActive: boolean;
};

type UserKeys = keyof User; // "id" | "name" | "isActive"

/*
| Concept             | Think of it as                    |
| ------------------- | --------------------------------- |
| `keyof T`           | “All legal property names of `T`” |
| `T[K]`              | “The value type at property `K`”  |
| `K extends keyof T` | “K must be a valid key of T”      |
*/
