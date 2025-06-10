//let myArr1 = [{page:"325"},{page:"-1"}];
//let myArr1 = [{page:"325"}];
//let myArr1 = [];
let myArr1 = null;

let found = myArr1.findIndex( element => element.page === "-1");

//console.log(found);

let result = myArr1.filter( element => element.page !== "-1");
console.log(result);