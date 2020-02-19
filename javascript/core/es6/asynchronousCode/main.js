// define asynchronous function
function loadScript(src) {
    // creates a <script> tag and append it to the page
    // this causes the script with given src to start loading and run when complete
    let script = document.createElement('script');
    script.src = src;
    document.head.append(script);
}


// define asynchronous function taking a callback
// asynchronous operation so accepts a callback to be invoked upon completion
function loadScript2(src, callback) {
    // creates a <script> tag and append it to the page
    // this causes the script with given src to start loading and run when complete
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => callback();

    document.head.append(script);
}


// load and execute the script at the given path
// executes asynchronously - so run to completion results in output shown below
loadScript("script1.js");

console.log("hello from main");
	
// output
// hello from main
// hello from script1
    
// suppose we want to use a function defined in script1
// func1(); doesn't work as run to completion ensures asynchronous functionality not complete

// pass a callback to be executed when script loads
loadScript2("script1.js", function() {
    func1();
})
console.log("async load script invoked");


	
