/*
Define an interface User with id: number, name: string, optional email: string.
Write a function formatUser(user: User): string that returns "Name (id)" or "Name (id, email)" if email exists.
*/

const api = (() => {

    interface User {
        id: number;
        name: string;
        email?: string;
    }

    function formatUser(user: User): string {
        return user.name + ' (' + user.id  + 
            (user?.email ? ( ',' + user.email) : '') + ')';
    }


    return { formatUser };
})();   

/*
formatUser({ id: 1, name: "Alice" }); // "Alice (1)"
formatUser({ id: 2, name: "Bob", email: "bob@example.com" }); // "Bob (2, bob@example.com)"

*/
console.log( api.formatUser({ id: 1, name: "Alice" }) );
console.log(api.formatUser({ id: 2, name: "Bob", email: "bob@example.com" }));