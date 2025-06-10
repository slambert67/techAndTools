let sandbox = require('./promise3');

beforeEach( () => {
    jest.useFakeTimers();
});

afterAll(() => {
    jest.useRealTimers()
})

test("2", async () => {

    const myPromise = sandbox.returnPromise('squoink');
    jest.advanceTimersByTime(2000);
    let result = await myPromise;
    expect(result).toEqual({msg: 'It works', data: 'squoink'});
});