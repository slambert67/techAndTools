// Partial<Type> - make all properties optional

type User = {
  id: number;
  name: string;
  email?: string;
}

type UpdateUser = Partial<User>;
// equivalent to
type PartialUser = {
  id?: number;
  name?: string;
  email?: string;
};


const updateUser = (user: UpdateUser) => {
  // you can pass only the fields you want to update
  console.log(user);
};

updateUser({ name: "Alice" });       // ✅ ok
updateUser({});                      // ✅ ok