// This is extremely common in APIs and async code.

type Result<T> = {
  data: T;
  error: string | null;
};

type User = { id: number; name: string };

const res: Result<User> = {
  data: { id: 1, name: "Alice" },
  error: null
};
