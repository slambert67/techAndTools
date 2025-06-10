// import the module to be tested
let module1 = require('./module1');

// group for testing publicSum function
describe("Test module1.sum", () => {

    test( "A simple public summation works", () => {
        const result = module1.publicSum(1,2)
        expect(result).toBe(3);
    });
});