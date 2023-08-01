function returnImagePromise(url){
    var promise = new Promise(
        // this callback function required with Promise constructor
        // this resolver function executes synchronously
        // all callbacks passed to then and catch are invoked asynchronously
        function resolver(resolve, reject) {
            var img = new Image();
            img.src = url;

            img.onload = function() {
                resolve(img);
            }

            img.onerror = function(e) {
                reject(e);
            }
        }
    );
    return promise;
}

async function loadImage(){

    var response = await returnImagePromise('custardcream.PNG');
    console.log(response);
    document.body.appendChild(response);
}

loadImage();
console.log('loadimage');