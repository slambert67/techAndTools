// Pick<Type, Keys> - Creates a new type with only the specified properties
type User = {
  id: number;
  name: string;
  email?: string;
}

type UserPreview = Pick<User, "id" | "name">;

const shortUser: UserPreview = {
  id: 1,
  name: "Diana",
  // email not allowed
};
// Use when exposing only a subset (e.g., public API view).