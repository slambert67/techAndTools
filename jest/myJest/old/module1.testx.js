// import the module to be tested
var m1 = require('./module1');

// group for testing sum function
describe("Test module1.sum", () => {

    test( "A simple summation works", () => {
        const result = m1.sum(1,2)
        expect(result).toBe(3);
    });

    test( "Another simple summation works", () => {
        const result = m1.sum2(3,4);
        expect(result).toBe(7);
    });
});