/*
States
======
    Pending
    -------
    The promise is still running (asynchronous work not finished yet)
    Neither fulfilled nor rejected
    No value is available yet

    const p = new Promise(() => {});        // p is pending forever


    Fulfilled (aka Resolved)
    ------------------------
    The asynchronous operation completed successfully
    The promise now has a value
    .then() callbacks will run

    const p = Promise.resolve(42);          // p is fulfilled with value 42


    Rejected
    --------
    The asynchronous operation failed
    The promise now has a reason (an error)
    .catch() callbacks will run

    const p = Promise.reject("Oops!");      // p is rejected with reason "Oops!"


    Settled
    -------
    Not a state
    Means no longer Pending i.e. Fulfilled or Rejected

*/

const promiseApi = ( () => {


    function createPromise() {

        /*
        JavaScript is calling the Promise constructor, and that constructor internally creates two functions:
            resolve → marks the promise as fulfilled
            reject → marks the promise as rejected

        ✔ resolve(value)
            Marks the promise as fulfilled
            Stores value
            Wakes up .then() handlers
        ✔ reject(error)
            Marks the promise as rejected
            Stores the error
            Wakes up .catch() handlers
        */

        // 
        


        // Constructor is the only way to create a promise where you manually call resolve or reject.

        // my code controls when resolve is called
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => resolve("p1 fulfilled"), 1000);
        }).then( (data) => console.log(data) );


        // my code controls when reject is called
        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => reject("p2 rejected"), 1000);
        }).catch( (data) => console.log(data) );


        // outputs before p1 and p2 because no asynchronous work required to resolve
        const p3 = Promise.resolve('p3 resolved').then( (data) => console.log(data) );  


        // outputs before p1 and p2 because no asynchronous work required to resolve
        const p4 = Promise.reject('p4 rejected').catch( (data) => console.log(data) ); 


        // async functions
        async function foo() {
            return 10;          // becomes Promise.resolve(10)
        }
        foo().then( (data) => console.log(`p5 resolved with value ${data}`) );


       async function foo2() {
            throw new Error('p6 rejected');  // becomes Promise.reject(Error)
        }
        foo2().catch( (err) => console.log(err));


        // async arrow function
        const p7 = async () => 123;
        p7().then((data) => console.log(`p7 resolved with value ${data}`)); // 123


        // Create a promise that resolves when all promises resolve.
        const p8 = Promise.all([Promise.resolve(1), Promise.resolve(2)]);
        p8.then( (data) => {console.log('All p8 promises resolved'); console.log(data)});


        // Settles as soon as any promise settles.
        async function foo3() {
            return new Promise((resolve) => {
                setTimeout(() => resolve("foo3 done"), 5000);
            });
        }
        async function foo4() {
            return new Promise((resolve) => {
                setTimeout(() => resolve("foo4 done"), 10000);
            });
        }            
        const p9 = Promise.race(
            [
                foo3(), foo4()
            ]
        );
        p9.then( () => console.log('First racing promise resolved'));

        const p9a = Promise.race([
            Promise.resolve(1),
            Promise.resolve(2)
        ]);
        p9a.then(() => console.log('First racing promise resolved again'));


        // all settled regardless of success or failure
        const p10 = Promise.allSettled([
            Promise.resolve(1),
            Promise.reject(2)
        ]);
        p10.then(() => console.log('All settled'));


        // first fulfilled promise
        const p11 = Promise.any([
            Promise.reject("bad"),
            Promise.resolve("good"),
        ]);
        p11.then(() => console.log('Any settled'));


        // .then(), .catch() and .finally() always return a Promise. This new Promise resolves or rejects depending on what your callback does.
    }


    function handleErrors() {

        // handle error with catch
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => reject("p1 rejected"), 1000);
        }).catch( (data) => console.log(data) );

        // handle error with then - can pass 2 callbacks
        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => reject("p2 rejected"), 1000);
        }).then( (data) => console.log(data),  (data) => console.log(data));
    }


    function promiseChain() {

        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => resolve("p1 fulfilled"), 1000);
        })
        .then( () => console.log('first link') )
        .then( () => console.log('second link') )
        .then( () => console.log('third link') )
        .finally( () => console.log('finally - fires on either fulfillment or rejection'));
    }


    function promiseTree() {

        // The “tree” arises when you attach multiple .then() handlers to the SAME promise
        // breadth first resolution

        /*
            Trees are conceptually important because:
            ✔ Multiple consumers can attach to the same promise

            The promise runs once, but any number of .then() handlers can listen.

            ✔ Each branch is independent

            One branch failing doesn’t break the others.

            ✔ You can fan-out and fan-in

            Tree structures allow:

            fan-out: one promise → many .then() handlers

            fan-in: many promises → Promise.all/race/any/allSettled


            Example of a real-world promise tree
            Imagine loading user data and then performing multiple independent tasks:

                const user = fetchUser();

                user
                .then(u => log(u))
                .then(() => updateAnalytics());

                user
                .then(u => renderProfile(u));

                user
                .then(u => notifyFriends(u));

        */

        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => resolve("p1 fulfilled"), 1000);
        });

        p1.then(a => console.log("branch A:", a)).then(() => console.log("branch A1:")).then(() => console.log("branch A1A:"));
        p1.then(b => console.log("branch B:", b)).then(() => console.log("branch B1:")).then(() => console.log("branch B1A:"));
    }

    return {createPromise, handleErrors, promiseChain, promiseTree};

})();

// promiseApi.createPromise();
//promiseApi.handleErrors();
promiseApi.promiseChain();
//promiseApi.promiseTree();