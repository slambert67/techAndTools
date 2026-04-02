// Sometimes T must have certain properties.

function lengthOf<T extends { length: number }>(value: T): number {
  return value.length;
}
// valid
lengthOf("hello");
lengthOf([1, 2, 3]);

// invalid
// lengthOf(123); // ❌ no length property


/*
T extends number
    does not mean T is number

    it means: T is some specific type assignable to number
*/

