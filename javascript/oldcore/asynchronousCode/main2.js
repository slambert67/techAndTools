// define asynchronous function taking a callback
// asynchronous operation so accepts a callback to be invoked upon completion
function loadScript(src, callback) {
    // creates a <script> tag and append it to the page
    // this causes the script with given src to start loading and run when complete
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => callback(script);

    document.head.append(script);
}


// pass a callback to be executed when script loads
loadScript("script1.js", function(callbackArg) {
    console.log(`Cool, the ${callbackArg.src} is loaded, let's load one more`);

    // callback within callback
    loadScript("script2.js", function(callbackArg) {
        console.log(`Cool, the second script is loaded`);

        // callback within callback within callback
        loadScript("script3.js", function(callbackArg) {
            console.log(`Cool, the third script is loaded`);
        });   
    });   
})
console.log("hello from main");


	
