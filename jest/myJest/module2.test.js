// import the module to be tested
let module2 = require('./module2');
let module2Dependency = require('./module2Dependency');

// group for testing dependencySum function
describe("Test external dependency without mock", () => {

    test( "Test external dependency without mock", () => {
        const result = module2.sum(1,2);
        expect(result).toBe(3);
    });
});


/*
Understanding the Difference bvetween jest.fn and est.spyOn
===========================================================
The core distinction between jest.fn() and jest.spyOn() comes down to their interaction with existing functions.
jest.spyOn() wraps an existing function, allowing you to observe calls and optionally replace the implementation,
jest.fn() provides a completely new function with no initial behavior.
 */

describe("Test external dependency by overriding dependency functions with jest.fn", () => {
    /*
        complete override of implementation
        often just mock return value
        helpful to remove dependencies
        jest.fn() it is a method to create a stub, it allows you to track calls, define return values etc

        import the external dependency (module2Dependency)
        override its public functions using jest.fn (module2Dependency.dependencySum)
        invoke as usual from dependent module (module2)
        evaluate expectations
        restore the mocked function - CANNOT DO THIS BECAUSE OVERRIDDEN!
     */
    test( "Test external dependency by overriding dependency functions with jest.fn", () => {

        module2Dependency.dependencySum = jest.fn( (a,b) => 7 );
        const actualResult = module2.sum(1,2);

        expect(module2Dependency.dependencySum).toHaveBeenCalledWith(1,2);
        expect(actualResult).toBe(7);

        // module2Dependency.dependencySum.mockRestore();  // removes dependencySum

    });
});

