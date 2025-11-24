// just a note - structuredclone!!!

/*for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}*/

const objectAPI = ( () => {


    function creation() {

        // object literals

            // standard literal
            const obj1 = { a: 1, b: 2 };
            console.log('standard literal'); console.log(obj1);

            // computed properties
            const key2 = 'a'; const value2 = 1;
            const obj2 = { [key2]: value2 };
            console.log('computed properties');console.log(obj2);

            // spread operator
            const obj3 = { a: 1, b: 2 };
            const obj4 = { ...obj3 };
            console.log('spread operator');console.log(obj4);


        // object constructor family

            // basic constructor
            const obj5 = new Object();
            console.log('basic constructor');console.log(obj5);

            // with a specified prototype
            //const obj6 = Object.create(proto);
            //console.log('with a specified prototype');console.log(obj6);

            // fromEntries
            const obj7 = Object.fromEntries([["a", 1], ["b", 2]]);
            console.log('fromEntries');console.log(obj7);

            // assignment
            const source = { a: 1, b: 2 };
            const obj8 = Object.assign({}, source);
            console.log('assignment');console.log(obj8);


        // Functions Acting as Constructors - before ES6 class

          // Constructor function + new
          function Person(name) { this.name = name; }
          const p = new Person("Alice");
          console.log('Constructor function + new');console.log(p);

          // factory function
          function makePoint(x, y) {
            return { x, y };
          }
          console.log('factory function');console.log( makePoint(6,7) );

        
        // ES6 classes

          // Basic class instantiation
          class User { 
            constructor(name) { 
              this.name = name; 
            } 
          }
          const u = new User("Bob");
          console.log('Basic class instantiation');console.log(u);

          // Classes extending other classes
          class Admin extends User {};
          const a = new Admin("Steve");
          console.log('Classes extending other classes');console.log(a);


        // JSON

          // Using JSON.parse()
          const obj9 = JSON.parse('{"a":1}');
          console.log('Using JSON.parse()');console.log(obj9);

        
        // Structured Cloning
        const obj10 = structuredClone(obj9);
        console.log('Structured Cloning');console.log(obj10);   // Creates a deeply cloned new object in modern JS.


        // Using modules
        // import * as moduleObj from "./file.js";      Modules themselves produce objects for namespaces:


        // Using proxy
        // const obj = new Proxy(target, handler);    Proxy creates a new object with behavior virtualization

        
        // Generator & Iterator Objects

          // Generator functions
          /* function* gen() {}
          const g = gen(); // g is a generator object */


          // Custom iterators
          /*const obj = {
            [Symbol.iterator]() {
              return { next() { return { value: 1, done: true }; } };
            }
          }; */


    }


    return { creation };
})();

objectAPI.creation();