let myPromise = require('./promise');


test("promise", () => {

    return myPromise.returnResolvedPromise('squoink').then(data => {
        expect(data.data).toBe('squoink');
        expect(data.msg).toBe('It works');
    });
});


// If you expect a promise to be rejected, use the .catch method. Make sure to add expect.assertions to verify that a certain number of assertions are called.
// Otherwise, a fulfilled promise would not fail the test.
test('the fetch fails with an error', () => {
    expect.assertions(1);
    return myPromise.returnRejectedPromise('squoink').catch(e => expect(e).toStrictEqual(new Error({msg: 'It does not work'}) ));
});


test('resolved promise with syntactic sugar', async () => {
    await expect(myPromise.returnResolvedPromise('squoink')).resolves.toStrictEqual({msg: 'It works', data: 'squoink'} );
});


test('rejected promise with syntactic sugar', async () => {
    await expect(myPromise.returnRejectedPromise('squoink')).rejects.toStrictEqual(new Error({msg: 'It does not work'}) );
});


