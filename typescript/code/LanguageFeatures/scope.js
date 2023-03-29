// block scope
var a = 1;
var b = 2;
// function scope
var c = 3; // old
// omission of const, let, var -> global scope
// a = a++; disallowed as can't reassign to a constant
// can mutate value of constant though
var d = [1, 2, 3];
d.push(4, 5, 6);
console.log(d);
