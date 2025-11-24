const sandboxAPI = ( () => {

    // counter with inc and get

    let counter = 0;

    function inc() {
        counter++;
    }

    function get() {
        return counter;
    }

    return {inc, get}
})();

console.log(sandboxAPI.get());
sandboxAPI.inc();
console.log(sandboxAPI.get());
