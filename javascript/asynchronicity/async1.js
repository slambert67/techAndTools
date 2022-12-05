const http = require('http');


function myDummyServer(y) {
    //var req = http.get('http://localhost:8080', (resp)=>{y(resp.statusCode)});

    setTimeout(()=> {
        y('It works');
    }, 5000);
}

function returnPromise() {
    console.log('getting promise');
    return new Promise(function(resolve, reject) {
        // Some imaginary 2000 ms timeout simulating a db call
        setTimeout(()=> {
            if (true) {
                resolve({msg: 'It works', data: 'some data'});
            } else {
                // If promise can not be fulfilled due to some errors like network failure
                reject(new Error({msg: 'It does not work'}));
            }
        }, 5000);
    });
}


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


// async await
// async before a function ensures it returns a promise
// await waits for promise to settle
console.log('start');
async function f() {
    let myPromise = returnPromise();
    console.log('before await command');
    let result = await myPromise;  // run to completion still works outside this function
    console.log('after await command');
    console.log(result);
}
f();
console.log('end');


