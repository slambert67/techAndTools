// Omit<Type, Keys> - Opposite of Pick - removes certain properties
type User = {
  id: number;
  name: string;
  email?: string;
}

type UserWithoutEmail = Omit<User, "email">;

const basicUser: UserWithoutEmail = {
  id: 2,
  name: "Eve",
  // email  excluded
};
// Use when you want everything except a few fields.