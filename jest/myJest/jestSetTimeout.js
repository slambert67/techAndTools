function countdown(time, progressCallback, doneCallback) {
    progressCallback(time);
    console.log(`in countdown with time = ${time}`);
    setTimeout(function() {
        if (time > 1) {
            console.log('about to make recursive call');
            countdown(time - 1, progressCallback, doneCallback);
        } else {
            doneCallback();
        }
    }, 1000);
}

module.exports = countdown;
// countdown(1, ()=>{console.log('egg')}, ()=>{console.log('chips')});