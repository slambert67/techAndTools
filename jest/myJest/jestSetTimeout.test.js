const countdown = require("./jestSetTimeout.js");

jest.useFakeTimers(); // <= This mocks out any call to setTimeout, setInterval with dummy functions

test("Should call the done callback when the timer has finished counting", () => {

    const progressCallbackSpy = jest.fn();
    const doneCallbackSpy = jest.fn();

/*    countdown(1, progressCallbackSpy, doneCallbackSpy);
    expect(progressCallbackSpy.mock.calls.length).toBe(1);*/  // works

/*    countdown(2, progressCallbackSpy, doneCallbackSpy);
    jest.advanceTimersByTime(1000);
    expect(progressCallbackSpy.mock.calls.length).toBe(2);*/  // works

    countdown(3, progressCallbackSpy, doneCallbackSpy);
    jest.advanceTimersByTime(1000);
    expect(progressCallbackSpy.mock.calls.length).toBe(2);
    jest.advanceTimersByTime(1000);
    expect(progressCallbackSpy.mock.calls.length).toBe(3);
    jest.advanceTimersByTime(1000);
    expect(progressCallbackSpy.mock.calls.length).toBe(3);
});