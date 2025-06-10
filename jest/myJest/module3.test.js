const module3Dependency = require("./module3Dependency");
const module3 = require("./module3");
describe("Test external dependency by using jest.spyOn", () => {
    /*
        Original implementation not overriden as with jest.fn
        want to add own implementation just for a specific scenario then reset
        just want to see if function was called
        jest.spyOn() allows you to convert an existing method on an object into a spy,
            that also allows you to track calls and re-define the original method implementation.
        jest.spyOn() allows you to take an existing function and add a layer of observation to it

        import the external dependency (module2Dependency)
        spy on public function using jest.spyOn (module2Dependency.dependencySum)
        invoke as usual from dependent module (module2)
        evaluate expectations
        restore the mocked function
     */
    test( "Test external dependency by using jest.spyOn", () => {

        jest.spyOn(module3Dependency, 'dependencySum2');
        module3Dependency.dependencySum2.mockImplementation( (a,b) => 11 );
        const actualResult = module3.sum2(1,2);
        expect(actualResult).toBe(11);

        module3Dependency.dependencySum2.mockRestore();
        const actualResult2 = module3.sum2(1,2);
        expect(actualResult2).toBe(3);

    });
});