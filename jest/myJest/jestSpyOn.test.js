/*
Sometimes you only want to watch a method be called, but keep the original implementation.
Other times you may want to mock the implementation, but restore the original later in the suite.

The key thing to remember about jest.spyOn is that it is just sugar for the basic jest.fn() usage.
We can achieve the same goal by storing the original implementation, setting the mock implementation
to to original, and re-assigning the original later
 */

let jestSpyOn = require('./jestSpyOn');
let myMath = require('./myMath');

test("calls myMath.add", () => {

    // add spy wrapper to myMath.add
    const myMathAddSpy = jest.spyOn(myMath, "add");

    // call the original implementation
    expect( jestSpyOn.doAdd(1,2) ).toEqual(3);

    // and the spy stores the calls to myMath.add
    expect( myMathAddSpy ).toHaveBeenCalledWith(1,2);
});


// In other cases, you may want to mock a function, but then restore the original implementation:
test("calls myMath.add", () => {

    // add spy wrapper to myMath.add
    const myMathAddSpy = jest.spyOn(myMath, "add");

    // override the implementation
    myMathAddSpy.mockImplementation( () => 11);
    expect( jestSpyOn.doAdd(1,2) ).toEqual(11);

    // restore the original implementation
    myMathAddSpy.mockRestore();
    expect( jestSpyOn.doAdd(1,2) ).toEqual(3);
});