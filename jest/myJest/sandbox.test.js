let sandbox = require('./sandbox');

// works when not using fake timers
/*test("promise without fake timers", () => {

    return sandbox.returnPromise('squoink').then(data => {
        expect(data.data).toBe('squoink');
        expect(data.msg).toBe('It works');
    });
});*/

jest.useFakeTimers();

test("promise with fake timers", async () => {
    let y;
    console.log("number of fake timers remaining:", jest.getTimerCount());
    //let x = sandbox.returnPromise('squoink').then( (y) => {return y;});
    // sandbox.returnPromise('squoink').then( (x) => { y = {...x}; console.log('printing y in callback');console.log(y);});
    jest.advanceTimersByTime(2000);
    jest.runAllTicks();
    y = await sandbox.returnPromise('squoink');
    console.log("number of fake timers remaining:", jest.getTimerCount());


    // await jest.runAllTimers(); works

    //expect(y.data).toEqual('squoink');
    console.log('printing y');
    console.log(y);

    expect(y.data).toEqual('squoink');
});