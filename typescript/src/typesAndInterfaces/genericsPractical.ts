// Tier 1 — Used Constantly (Daily / Weekly)

// Generic Interfaces
/*
interface ApiResponse<T> {
  data: T;
  error?: string;
}
  */


// Generic Utility Types (Standard Library)
/*
Partial<T>
Pick<T, K>
Omit<T, K>
Record<K, V>
Readonly<T>
*/

// original type
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}


// Partial - allows updates to be a subset of User. converts all properties to optional
function updateUser(user: User, updates: Partial<User>) {
  return { ...user, ...updates };
}   
const user = { id: "1", name: "Alice", email: "alice@example.com", passwordHash:'xyz' };
const updatedUser = updateUser(user, { name: "Bob" });
console.log(updatedUser);



// Use Pick to Create a Safe Public Type
type PublicUser = Pick<User, "id" | "name" | "email">;

// usage
function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}


// pick and partial in DTOs
interface User2 {
  id: string;             // server-generated
  name: string;
  email: string;
  passwordHash: string;   // sensitive
  role: "admin" | "user";
  bio?: string;
}

// Create the Update DTO - We want the client to only be able to update some fields (name, email, bio, maybe password), and all should be optional.
type UpdateUserDto = Partial<Pick<User2, "name" | "email" | "bio">> & {
  password?: string;
};
// Pick selects only the fields the client is allowed to update
// Partial makes all of those fields optional, so the client can update any subset
// Adds an extra optional field (password) not present in User directly

// example usage
function updateUser2(user: User2, updates: UpdateUserDto): User2 {
  return {
    ...user,
    ...updates.password ? { passwordHash: hashPassword(updates.password) } : {},
    ...updates,
  };
}

// Hypothetical hash function
function hashPassword(pw: string): string {
  return "hashed-" + pw;
}

// calling the function
const user3: User2 = {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
  passwordHash: "secret",
  role: "user",
  bio: "Loves TypeScript",
};

// Update only the name
const updatedUser1 = updateUser2(user3, { name: "Bob" });

// Update bio and password
const updatedUser2 = updateUser2(user3, { bio: "New bio", password: "newpassword" });

// Update email only
const updatedUser3 = updateUser2(user3, { email: "bob@example.com" });








// keyof + Indexed Access (T[K])
/*
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
*/


// Generic Functions
/*
function wrap<T>(value: T): { value: T } {
  return { value };
}
*/


// Generic Constraints (extends)
/*
function withId<T extends { id: string }>(x: T) {
  return x.id;
}
*/
