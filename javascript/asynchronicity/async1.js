const http = require('http');


function myDummyServer(y) {
    //var req = http.get('http://localhost:8080', (resp)=>{y(resp.statusCode)});

    setTimeout(()=> {
        y('It works');
    }, 5000);
}

function returnPromise(myData) {
    //console.log('getting promise');
    return new Promise(function(resolve, reject) {
        // Some imaginary 2000 ms timeout simulating a db call
        setTimeout(()=> {
            if (true) {
                resolve({msg: 'It works', data: myData});
            } else {
                // If promise can not be fulfilled due to some errors like network failure
                reject(new Error({msg: 'It does not work'}));
            }
        }, 5000);
    });
}

// async await
// async before a function ensures it returns a promise
// await waits for promise to settle


// example with await outside async function
async function f(data) {
    let myPromise = returnPromise(data);
    console.log('leaving async function');
}

async function myMain() {
    console.log('start');
    await f('promise1');
    console.log('end');
}
myMain();


// example with await inside async function
/*function synchronousFunction(data) {
    console.log('synchronous function called - ' + data)
}
async function f(data) {
    let myPromise = returnPromise(data);
    console.log('before await command');
    synchronousFunction('Before await - ' + data);
    let result = await myPromise;  // run to completion still works outside this function
    // commands following await are synonymous with promise.then?
    synchronousFunction('After await - ' + data);
    console.log('after await command');
    console.log(result);
}
console.log('start');
f('promise1');
f('promise2');
console.log('end');*/





// callback
/*console.log('start');
function myCallback(x) {
    console.log(x);
}
myDummyServer( myCallback );
console.log('end');
*/

// promise
/*console.log('start');
let myPromise = returnPromise();
myPromise.then((result) => {
    console.log("Success", result);
}).catch((error) => {
    console.log("Error", error);
});
console.log('end');*/





