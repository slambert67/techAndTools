// Readonly<Type> - Makes all properties read-only — can’t reassign them.
type User = {
  id: number;
  name: string;
  email?: string;
}

const user: Readonly<User> = {
  id: 1,
  name: "Charlie",
  email: "charlie@email.com",
};
// user.name = "New Name";  Error: Cannot assign to 'name'