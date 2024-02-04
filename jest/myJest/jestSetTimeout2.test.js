const callAfterThreeSeconds = require("./jestSetTimeout2.js");

jest.spyOn(global, "setTimeout");

/*test("should call callback after 3 second", (done) => {
    const mockCallback = jest.fn();
    callAfterThreeSeconds(mockCallback);

    setTimeout(() => {
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
        expect(mockCallback).toHaveBeenCalled();
        done();
    }, 3000);
});*/

// what if 24hr wait?

/*
Timer methods callbacks are queued in the event loop and are popped from the queue and executed when the time is complete.
In tests, we can bypass the timeout and run the callback immediately.
 */

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

test("should wait 10 second before call callback", () => {
    const mockCallback = jest.fn();

    console.log("number of fake timers remaining:", jest.getTimerCount());
    callAfterThreeSeconds(mockCallback);
    console.log("number of fake timers remaining:", jest.getTimerCount());

    // make sure the callback is not called because
    // the timers don't expire before runAllTimers
    expect(mockCallback).not.toHaveBeenCalled();

    //jest.runAllTimers();
    jest.advanceTimersByTime(3000);
    console.log("number of fake timers remaining:", jest.getTimerCount());

    expect(mockCallback).toHaveBeenCalled();
});