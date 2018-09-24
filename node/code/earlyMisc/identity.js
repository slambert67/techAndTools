/**
 *
 */
var fs = require('fs');

function FileObject() {
    // add property
    this.filename = '';

    // add method
    this.file_exists_fails = function(callback) {
        console.log("About to open: " + this.filename);
        
        /**
         * fs.open: (asynchronously)
         * - initializes itself
         * - calls underlying operating system function
         * - places provided callback on event queue
         * - execution immediately returns to file_exists function
         *
         * fs.open completes
         * - Node runs provided callback
         * - no longer have context of FileObject class anymore!
         * - callback function given a new this pointer!
         * 
         * However
         * - callback function for fs.open still has it's function scope
         * - declare var self = this file_exists function
         * - FUNCTION SCOPE IS PRESERVED BY CLOSURES
         */
        fs.open(this.filename, 'r', function(err, handle){
            if (err) {
                console.log("Cannot open: " + this.filename);
                callback(err);
                return;
            }
            fs.close(handle, function(){});
            callback(null, true);
        });
    }
    
        // add method
    this.file_exists_passes = function(callback) {
        var self = this;
        
        console.log("About to open: " + self.filename);
        
        /**
         * fs.open: (asynchronously)
         * - initializes itself
         * - calls underlying operating system function
         * - places provided callback on event queue
         * - execution immediately returns to file_exists function
         *
         * fs.open completes
         * - Node runs provided callback
         * - no longer have context of FileObject class anymore!
         * - callback function given a new this pointer!
         * 
         * However
         * - callback function for fs.open still has it's function scope
         * - declare var self = this file_exists function
         * - FUNCTION SCOPE IS PRESERVED BY CLOSURES
         */
        fs.open(this.filename, 'r', function(err, handle){
            if (err) {
                console.log("Cannot open: " + self.filename);
                callback(err);
                return;
            }
            fs.close(handle, function(){});
            callback(null, true);
        });
    }
}

var fo = new FileObject();
fo.filename = "file_that_does_not_exist";

fo.file_exists_fails( function(err, results) {
    if (err) {
        console.log("Aw, bummer: " + JSON.stringify(err));
        return;
    } 
    console.log("file exists");    
});

fo.file_exists_passes( function(err, results) {
    if (err) {
        console.log("Aw, bummer: " + JSON.stringify(err));
        return;
    } 
    console.log("file exists");    
});