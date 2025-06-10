let jestFn = require('./jestFn');
let myMath = require('./myMath');

// myMath is a dependency of jestFn

/*
The most basic strategy for mocking is to reassign a function to the Mock Function
Then, anywhere the reassigned functions are used, the mock will be called instead of the original function
This type of mocking is less common for a couple reasons:
- jest.mock does this automatically for all functions in a module
- jest.spyOn does the same thing but allows restoring the original function
*/

test("assign mock function to dependency function", () => {

    // assign mock function to dependency function
    const mock = jest.fn();
    mock.mockReturnValue(11);
    myMath.add = mock;

    // invoke dependent module as per usual
    jestFn.doAdd(1,2);

    // evaluate expectations against mocked function
    expect(myMath.add).toHaveBeenCalledWith(1,2);
    expect(myMath.add()).toBe(11);
});
