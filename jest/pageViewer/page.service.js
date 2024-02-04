//import {of} from "rxjs";

let rxjs = require('rxjs');

let getPageDescriptor = function() {
    setTimeout( () => {return rxjs.of(666)}, 1000 );
}

module.exports = {
    getPageDescriptor: getPageDescriptor
}