// A base class representing a generic user in a system
class User {
    // --------------------------------------------
    // 1. Public instance field (added per instance)
    // --------------------------------------------
    role = "guest";

    // --------------------------------------------
    // 2. Private field (#field)
    // Fully hidden; not accessible outside the class
    // --------------------------------------------
    #id = Math.floor(Math.random() * 10_000);

    // --------------------------------------------
    // 3. Static class-level property (belongs to class, not instances)
    // --------------------------------------------
    static userCount = 0;

    // --------------------------------------------
    // 4. Static initialization block (runs once when class is evaluated)
    // Useful for setting up static state
    // --------------------------------------------
    static {
        console.log("User class is being initialized...");
    }

    // --------------------------------------------
    // 5. Constructor — runs when an instance is created with `new`
    // --------------------------------------------
    constructor(name, email) {
        this.name = name;        // normal instance property
        this.email = email;

        User.userCount++;        // static property access
    }

    // --------------------------------------------
    // 6. Prototype method (shared by all instances)
    // --------------------------------------------
    greet() {
        console.log(`Hello, I'm ${this.name}!`);
    }

    // --------------------------------------------
    // 7. Arrow-function instance method
    // Each instance gets its own copy; keeps `this` bound
    // --------------------------------------------
    sayEmail = () => {
        console.log(`My email is: ${this.email}`);
    };

    // --------------------------------------------
    // 8. Getter — acts like a property but runs logic
    // --------------------------------------------
    get id() {
        return this.#id;     // access private field
    }

    // --------------------------------------------
    // 9. Setter — validate or transform values on assignment
    // --------------------------------------------
    set emailAddress(value) {
        if (!value.includes("@")) {
        throw new Error("Invalid email address");
        }
        this.email = value;
    }

    // --------------------------------------------
    // 10. Static method — belongs to the class itself
    // --------------------------------------------
    static describe() {
        return `This class tracks users. Total users: ${User.userCount}`;
    }

    // --------------------------------------------
    // 11. Computed method name
    // This creates a method whose name is based on a variable/expression.
    // --------------------------------------------
    ["display-role"]() {
        console.log(`Role: ${this.role}`);
    }
}


// A specialized administrator class with elevated privileges
class Admin extends User {
  // --------------------------------------------
  // 1. Public instance field (unique to Admin)
  // --------------------------------------------
  role = "admin";

  // --------------------------------------------
  // 2. Private field (unique to Admin)
  // --------------------------------------------
  #permissions = ["read", "write", "delete"];

  // --------------------------------------------
  // 3. Static property on subclass
  // --------------------------------------------
  static adminCount = 0;

  // --------------------------------------------
  // 4. Constructor uses `super` to call parent constructor
  // --------------------------------------------
  constructor(name, email, department) {
    super(name, email);      // MUST call first in derived class

    this.department = department;
    Admin.adminCount++;
  }

  // --------------------------------------------
  // 5. Overriding a parent method
  // --------------------------------------------
  greet() {
    super.greet();  // call parent's version
    console.log(`I am an admin of ${this.department}`);
  }

  // --------------------------------------------
  // 6. Method accessing Admin-specific private field
  // --------------------------------------------
  showPermissions() {
    console.log(`Permissions: ${this.#permissions.join(", ")}`);
  }

  // --------------------------------------------
  // 7. Static method (unique to Admin)
  // --------------------------------------------
  static describe() {
    return `Admins in system: ${Admin.adminCount}`;
  }
}


const user1 = new User("Alice", "alice@example.com");
const admin1 = new Admin("Bob", "bob@example.com", "IT");

// Instance methods
user1.greet();
admin1.greet();

// Using getters
console.log("User ID:", user1.id);

// Setter with validation
user1.emailAddress = "alice_new@example.com";

// Static methods
console.log(User.describe());
console.log(Admin.describe());

// Computed method
user1["display-role"]();

// Admin-specific functionality
admin1.showPermissions();

