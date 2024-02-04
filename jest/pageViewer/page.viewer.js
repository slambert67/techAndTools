// imports
let pageService = require('./page.service.js');
//import {getPageDescriptor} from './page.service';

// public
let pageNumber=0;
let pageDescriptor=0;

let setPageNumber = async function(page) {
     setTimeout( () => { console.log(`setting exports.pageNumber = ${page}`); exports.pageNumber = page}, 1000 );
}


let handlePageUpdate = async function(page) {

    let pageDescriptorSubscription;

    await pageService.getPageDescriptor().subscribe( async (d) => {
        exports.pageDescriptor = d;
    });
}

module.exports = {
    pageNumber:pageNumber,
    pageDescriptor:pageDescriptor,
    setPageNumber:setPageNumber,
    handlePageUpdate:handlePageUpdate
}