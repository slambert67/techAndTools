class Person {

    firstName : string;
    lastName : string;
    greet() {
        console.log('Hey there');
    }
}

class Programmer extends Person {

}

var aPerson: Person = new Person();

aPerson.greet();


