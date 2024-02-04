function callAfterThreeSeconds(callback) {
    console.log("before setTimeout");

    setTimeout(() => {
        console.log("before callback");
        callback();
        console.log("after callback");
    }, 3000);

    console.log("after setTimeout");
}

module.exports = callAfterThreeSeconds;

