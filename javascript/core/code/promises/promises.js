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

    return {createPromise};

})();

promiseApi.createPromise();