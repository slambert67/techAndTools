let myAsyncAwait = require('./asyncAwait');

test("async await", async () => {
    console.log(`Requesting Promise at ${new Date().getTime()}`);
    const data = await myAsyncAwait.returnPromise('squoink');
    console.log(`Received resolved promise at ${new Date().getTime()}`);
    expect(data.data).toBe('squoink');
    expect(data.msg).toBe('It works');
});