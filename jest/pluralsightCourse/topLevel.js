var l1 = require('./level1');

console.log('Top level');
l1.printl1();

console.log( l1.jestFunc1(1,2) );

dummyFuncRecipient = (x) => {
    console.log('hello from dummyfuncrecipient');
    x();
}

const dummyFunc = ()=> {console.log('hello world from dummyFunc')};
dummyFuncRecipient(dummyFunc);
//dummyFunc();