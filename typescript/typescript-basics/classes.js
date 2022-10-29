var Person = /** @class */ (function () {
    function Person() {
    }
    Person.prototype.greet = function () {
        console.log('Hey there');
    };
    return Person;
}());
var aPerson = new Person();
aPerson.greet();
