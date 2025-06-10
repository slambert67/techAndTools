let jestMock = require('./jestMock');
let myMath = require('./myMath');

// mock every public function of dependency. Essentially gives:
// export const add      = jest.fn();
// export const subtract = jest.fn();
jest.mock("./myMath");

test("xxx", () => {

    // invoke dependent module as per usual
    jestMock.doAdd(1,2);

    // evaluate expectations against mocked function
    expect(myMath.add).toHaveBeenCalledWith(1,2);
});