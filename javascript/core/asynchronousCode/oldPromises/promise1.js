function loadImage(url) {

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

loadImage('custardcream.PNG')
.then ( function(img){
  document.body.appendChild(img);
})
.catch ( function() {
  console.log("error occurred while loading image");
  console.log(e);
});