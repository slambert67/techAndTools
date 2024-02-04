let sandbox = require('./sandbox');

test("1", () => {

    // RETURN A PROMISE from your test, and Jest will wait for that promise to resolve
    // sandbox returns a promise that resolves to {msg: 'It works', data: myData}

    return sandbox.returnPromise('squoink').then( (result) => {
        expect(result.data).toBe('squoink');
    });
});


test("2", async () => {

    /*Alternatively, you can use async and await in your tests.
    To write an async test, use the async keyword in front of the function passed to test.
    For example, the same fetchData scenario can be tested with:*/

    const result = await sandbox.returnPromise('squoink');
    expect(result.data).toBe('squoink');
});

/*
test('the fetch fails with an error', async () => {
    expect.assertions(1);
    try {
        await fetchData();
    } catch (error) {
        expect(error).toMatch('error');
    }
});*/

test("3", async () => {

    /*You can combine async and await with .resolves or .rejects.*/
    await expect(sandbox.returnPromise('squoink')).resolves.toEqual({msg: 'It works', data: 'squoink'});
});
