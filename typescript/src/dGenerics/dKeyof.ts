// Safe Property Access
function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice" };

getProperty(user, "name"); // string
getProperty(user, "id");   // number
//getProperty(user, "email"); // ❌ error

