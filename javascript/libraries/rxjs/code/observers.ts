// An Observer is a consumer of values delivered by an Observable
// Observers are simply a set of callbacks, one for each type of notification delivered by the Observable: next, error, and complete
// Observers are just objects with three callbacks, one for each type of notification that an Observable may deliver
// Observers in RxJS may also be partial. If you don't provide one of the callbacks, the execution of the Observable will still happen normally,
// - except some types of notifications will be ignored, because they don't have a corresponding callback in the Observer.
// While the Observer is the public API for consuming the values of an Observable, all Observers get converted to a Subscriber,
// in order to provide Subscription-like capabilities such as unsubscribe. Subscriber is a common type in RxJS, and crucial for implementing operators, but it is rarely used as a public API.
