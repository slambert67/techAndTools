// Improved version with error handling

// define asynchronous function taking a callback
// asynchronous operation so accepts a callback to be invoked upon completion
function loadScript(src, callback) {
    // creates a <script> tag and append it to the page
    // this causes the script with given src to start loading and run when complete
    let script = document.createElement('script');
    script.src = src;

    // pass error to callback where appropriate
    script.onload = () => callback(null, script);
    script.onerror = () => callback( new Error(`Script load error for ${src}`) )

    document.head.append(script);
}


// pass a callback to be executed when script loads
loadScript("script1.js", function(error, callbackArg) {
    console.log(`Cool, the ${callbackArg.src} is loaded, let's load one more`);

    // callback within callback
    loadScript("script2.js", function(error, callbackArg) {
        console.log(`Cool, the second script is loaded`);

        // callback within callback within callback
        loadScript("script4.js", function(error, callbackArg) {
            console.log(`Bugger, the fourth script failed to load`);
            console.log(error);
        });   
    });   
})
console.log("hello from main");


	
