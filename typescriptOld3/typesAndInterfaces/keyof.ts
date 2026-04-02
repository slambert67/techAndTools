(() => {

    // keyof takes a type and produces a union of its property names.

    type User = {
        id: number;
        name: string;
        email: string;
    };

    type UserKeys = keyof User;
    // "id" | "name" | "email" - So UserKeys is not an array — it’s a type union of strings that correspond to the keys.


    // 1. Type-safe property access (the “get property” pattern)
    // This pattern enforces key correctness — no typos or invalid keys allowed

    function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
        return obj[key];
    }

    const user = { id: 1, name: 'Alice', active: true };

    const name = getProperty(user, 'name'); // ✅ type is string
    const id = getProperty(user, 'id');     // ✅ type is number

    // getProperty(user, 'age'); ❌ Error — "age" not in user
    // const age = user.age;   Error also so why is getProperty useful?

    // The key idea

    // TypeScript does catch user.age when you type it directly in code —
    // because it can see the object literal at compile time.

    // But what if the property name is dynamic (a variable, function parameter, etc.)?
    // That’s where keyof becomes essential.

    // case                     typescript knows the object                 dynamic or external
    // user.name                typescript can check it directly            No need for keyof
    // getProperty(user,key)    typescript doesn't know what key is         keyof enforces validity


    // keyof doesn’t fix a runtime exception — it prevents you from writing code that could cause one.
    // so we also need runtime protection

    // 2 layers of defense - combine TypeScript (compile-time) + runtime validation

    // compile time - typescript
    function getProperty2<T, K extends keyof T>(obj: T, key: K) {
        return obj[key];
    }

    // runtime validation - javascript
    // To safely handle external data, e.g. user input, JSON, API fields, etc.

    function safeGet<T extends object>(obj: T, key: string) {
        if (key in obj) {
            return obj[key as keyof T];
        } else {
            throw new Error(`Invalid key: ${key}`);
        }
    }

    const field = prompt('Enter field name:');
    safeGet({ id: 1, name: 'Alice' }, field!);



})();