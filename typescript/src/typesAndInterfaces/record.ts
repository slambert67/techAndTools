

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





