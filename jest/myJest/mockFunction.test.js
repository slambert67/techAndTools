test("create a simple mock function", () => {
    const mock = jest.fn();

    let result = mock("foo");  // call the mock function with foo as an argument
    expect(result).toBeUndefined();
    expect(mock).toHaveBeenCalled();
    expect(mock).toBeCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("foo");

});

test("mock return value", () => {
    const mock = jest.fn();
    mock.mockReturnValue("bar");

    expect(mock("foo")).toBe("bar");
    expect(mock).toHaveBeenCalledWith("foo");
});

test("mock implementation", () => {
    const mock = jest.fn(() => "bar");

    expect(mock("foo")).toBe("bar");
    expect(mock).toHaveBeenCalledWith("foo");
});

test("also mock implementation", () => {
    const mock = jest.fn().mockImplementation(() => "bar2");

    expect(mock("foo")).toBe("bar2");
    expect(mock).toHaveBeenCalledWith("foo");
});


// Implementation reverts after this?
test("mock implementation one time", () => {
    const mock = jest.fn().mockImplementationOnce(() => "bar");

    expect(mock("foo")).toBe("bar");
    expect(mock).toHaveBeenCalledWith("foo");

    expect(mock("baz")).toBe(undefined);
    expect(mock).toHaveBeenCalledWith("baz");
});

test("mock promise resolution", () => {
    const mock = jest.fn();
    mock.mockResolvedValue("bar");

    expect(mock("foo")).resolves.toBe("bar");
    expect(mock).toHaveBeenCalledWith("foo");
});


// Dependency Injection
const doAdd = (a, b, callback) => {
    callback(a + b);
};

test("calls callback with arguments added", () => {
    const mockCallback = jest.fn();
    doAdd(1, 2, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(3);
});