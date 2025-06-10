let sandbox = require('./promise3');

beforeEach( () => {
    // jest.useFakeTimers({ doNotFake: ['nextTick'] });
    jest.useFakeTimers();
});

afterAll(() => {
    jest.useRealTimers()
})

test("1", async () => {

    const myPromise = sandbox.returnPromise('squoink');
    jest.advanceTimersByTime(2000);
    // jest.runOnlyPendingTimers();
    // await new Promise(process.nextTick);
    return expect(myPromise).resolves.toEqual({msg: 'It works', data: 'squoink'});
});

test("2", async () => {

    const myPromise = sandbox.returnPromise('squoink');
    jest.advanceTimersByTime(2000);
    let result = await myPromise;
    expect(result).toEqual({msg: 'It works', data: 'squoink'});
});