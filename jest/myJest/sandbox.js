exports.returnPromise = function(myData) {
    return new Promise(function(resolve, reject) {
        // Some imaginary 2000 ms timeout simulating a db call
        setTimeout(()=> {
            if (true) {
                resolve({msg: 'It works', data: myData});
            } else {
                // If promise can not be fulfilled due to some errors like network failure
                reject(new Error({msg: 'It does not work'}));
            }
        }, 2000);
    });
}

