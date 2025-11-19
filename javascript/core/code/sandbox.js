const api = (() => {
    
    function hello() {
        console.log('hello');
    }

    function world() {
        console.log('world');
    }
    return {hello, world};
})();

api.hello();
api.world();