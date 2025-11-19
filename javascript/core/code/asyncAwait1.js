function returnPromise(myData, delay) {
    // console.log('getting promise');
    return new Promise(function(resolve, reject) {
        // Some fabricated timeout simulating a db call
        setTimeout(()=> {
            if (true) {
                resolve({msg: 'It works', data: myData});
            } else {
                // If promise can not be fulfilled due to some errors like network failure
                reject(new Error({msg: 'It does not work'}));
            }
        }, delay);
    });
}

// example use of then
/*function f() {
    let myPromise = returnPromise('squoink');
    myPromise.then( (x) => console.log(x));
}
f();*/

// example use of async await
/*async function  f() {
    await returnPromise('squoink',2000);
    console.log('This appears after run to completion');
}
f();
console.log('This is logged before promise is resolved');*/

/*async function  f() {
    let x = await returnPromise('squoink',2000);
    console.log('This appears after run to completion');
    console.log(x);
}
f();
console.log('This is logged before promise is resolved');*/


// example of assigning result of await
/*function  f(data,delay) {
    return returnPromise(data,delay);
}

async function main() {
    let x = await f('squoink',2000);
    console.log(x);
    console.log('This is logged after promise is resolved');

    // f().then( (x) => console.log(x));
}
main();*/


// example of sequential awaits. Need Promise.all to execute them concurrently
/*
function  f(data,delay) {
    return returnPromise(data,delay);
}

async function main() {
    let x = await f('squoink5000',5000);
    console.log(x);
    let y = await f('squoink2000',2000);
    console.log(y);
    console.log('This is logged after promise is resolved');
}
main();*/


// example of promise.all
function f(data,delay) {
    return returnPromise(data,delay);
}

async function main() {
    let x = f('squoink5000',5000);
    let y = f('squoink2000',2000);
    /*x.then( (d) => console.log(d));
    y.then( (d) => console.log(d));*/
    //Promise.all([x,y]);

    const results = await Promise.all([x,y]);
    console.log(results);
}
main();