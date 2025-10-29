interface Userx {
  id: number;
  name: string;
  email?: string;
}


// Partial<Type> - make all properties optional
const updateUser = (user: Partial<Userx>) => {
  // you can pass only the fields you want to update
  console.log(user);
};

updateUser({ name: "Alice" });       // ✅ ok
updateUser({});                      // ✅ ok
// Use when updating or patching objects.


// equivalent to
type PartialUser = {
  id?: number;
  name?: string;
  email?: string;
};


//Implement Partial<T> manually
type MyPartial2<T> = {
  [P in keyof T]?: T[P];
};
const u2: MyPartial2<Userx> = { name: 'Alice' }; // ✅ should compile



// Required<Type> - make all properties required - even optional ones
type CompleteUser = Required<Userx>;

const u3: CompleteUser = {
  id: 1,
  name: "Bob",
  email: "bob@email.com", // now required
};
// Use when you need a fully-populated version of a type (e.g., after validation)




// Readonly<Type> - Makes all properties read-only — can’t reassign them.
const user: Readonly<Userx> = {
  id: 1,
  name: "Charlie",
  email: "charlie@email.com",
};
// user.name = "New Name";  Error: Cannot assign to 'name'



// Pick<Type, Keys> - Creates a new type with only the specified properties
type UserPreview = Pick<Userx, "id" | "name">;

const shortUser: UserPreview = {
  id: 1,
  name: "Diana",
  // email not allowed
};
// Use when exposing only a subset (e.g., public API view).




// Omit<Type, Keys> - Opposite of Pick - removes certain properties
type UserWithoutEmail = Omit<Userx, "email">;

const basicUser: UserWithoutEmail = {
  id: 2,
  name: "Eve",
  // email  excluded
};
// Use when you want everything except a few fields.




// Record<Keys, Type> - Constructs an object type with specific keys and value type.
type UserRoles = "admin" | "editor" | "viewer";

const permissions: Record<UserRoles, boolean> = {
  admin: true,
  editor: true,
  viewer: false,
};
// Use for dictionaries, maps, and configuration objects.


// equivalent to
type Permissions2 = {
  admin: boolean;
  editor: boolean;
  viewer: boolean;
};





