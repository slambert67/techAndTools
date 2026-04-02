// Required<Type> - make all properties required - even optional ones
type User = {
  id: number;
  name: string;
  email?: string;
}

type CompleteUser = Required<User>;

const u3: CompleteUser = {
  id: 1,
  name: "Bob",
  email: "bob@email.com", // now required
};
// Use when you need a fully-populated version of a type (e.g., after validation)