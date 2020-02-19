function loadImage(url,success,error) {
  // asynchronous so accepts callbacks
  var img = new Image();
  img.src = url;  // setting src loads image asynchronously

  img.onload = function() {
    success(img);
  }

  img.onerror = function(e) {
    error(e); 
 }
}

loadImage('custardcream.PNG',
          function onsuccess(img) {
            document.body.appendChild(img);
          },
          function onerror(e) {
            console.log("error occurred while loading image");
            console.log(e);
          }
         );