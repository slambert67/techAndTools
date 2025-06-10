// import doesn't work - why?
var l1 = require('../../level1');


// execute with npm test
// npm test level1/lib/main.test.js
// must have .test in name to be found by jest
// can keep test files with source or in own test director

// the following hooks can be added in a describe block so only applicable to those tests

beforeAll( () => {
    // runs once before any tests have run
    console.log("beforeAll");
});

beforeEach( () => {
    // runs before each test
    console.log("beforeEach");
});

afterEach( () => {
    // runs after each test
    console.log("afterEach");
});

afterAll( () => {
    // runs once after all tests
    console.log("AfterAll");
});


// group tests for a function in a describe block
describe("squoink group", () => {

    test( "first summation works", () => {
        const result = l1.jestFunc1(1,2);
        expect(result).toBe(3);
    });

    test( "second summation works", () => {
        const result = l1.jestFunc1(3,4);
        expect(result).toBe(7);
    });

    test( "catch an error", () => {
        expect( () => {
            jestError();
        }).toThrow();
    });

    test( "catch an error 2", () => {
        expect( () => {
            l1.jestError();
        }).toThrow(Error);
    });

    test( "catch an error 3", () => {
        expect( () => {
            l1.jestError();
        }).toThrow(/^squoink$/);
    });

    test( "catch an error 4", () => {
        expect( () => {
            l1.jestError();
        }).toThrow(new Error('squoink'));
    });

/*addxxx = function(x) {
x();
return 1;
}*/

/*function dependency() {
    return 1;
}
function dependent(y) {
    return y();
}
test( "dependency summation works", () => {
    const result = dependent(dependency);
    expect(result).toBe(1);
});

});*/  // WORKS

    function dependency() {
        return 1;
    }

    test( "dependency summation works", () => {
        const result = l1.dependent(dependency);
        expect(result).toBe(1);
    });

});


// matchers
// use .not before a matcher
// .toBe fine for primitive types
// toEqual - recursively compare all properties of 2 objects
// toStrictEqual - e.g. undefined properties checked
// toMatch - regular expression
// toBeTruthy / toBeFalsy

// errors
// toThrow matcher

// mocking
// allows us to test LINKS BETWEEN CODE by erasing actual implementation
// sometimes referred to as spys as calls to mock functions are captured by them
// allows for configuration of return values
// basically removing and controlling dependencies
// 3 ways to mock functions: creating simple, automock, creating manual
// all mocks have a mock property
// built-in functions can be mocked.
// e.g. const randomMock = jest.spyOn(global.Math, 'random').mockReturnValue(7)
// date stuff
// const now = new Date(2022,11,15,12,30)
// const eventDate = new Date(2022,11.15,19,45)
// jest.useFakeTimers().setSystemTime(now)
//
// autoMock
// toggled in jest.mock.json
// {"automock":true}
// mock all imported modules
// must manually unmock function to be tested. jest.unmock
//
// manual mock - create mock from module
// const purchaseHistory = jest.createMockFromModule('../PurchaseHistory'; (in /purchaseHistory/__mocks__





describe("mock group", () => {

    test( "first mock", () => {
/*        const dummyFunc = ()=> {console.log('hello world from dummyFunc')};
        const result = l1.addxxx(dummyFunc);
        expect(result).toBe(1);*/


        const dummyFuncMock = jest.fn( (x)=> {console.log('hello world from dummyFuncMock')});
        const result = l1.addxxx(dummyFuncMock);
        expect(dummyFuncMock).toHaveBeenCalled();
        expect(dummyFuncMock.mock.calls.length).toBe(2);

        // mock.calls[x]    - [x] = array of invokations
        // mock.calls[x][y] -   [y] = array of parameters
        expect(dummyFuncMock.mock.calls[0][0]).toBe(3);  // first call with a value of 3
        expect(dummyFuncMock.mock.calls[1][0]).toBe(4);  // first call with a value of 3
    });
});
