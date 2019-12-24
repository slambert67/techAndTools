var async = require('async');

console.log('hello world');

/*
async.waterfall
*/

async.waterfall(

  // argument 1: an array of functions to be executed in order
  // all functions (except 1st) take 2 arguments
  // Using the arguments, you can access the result of the previous step and also invoke the next step.
  [
    // define function for each step
    function ( done ) {
      console.log('first step');

      done(
        null, // 1st argument is any error to pass onto next step
        'value from first step'
      );
    },

    function ( previousResult, done) {
      console.log('second step');
      console.log('previous result = ' + previousResult);
      done(null);
    }
  ],

  // argument 2: function to catch any errors from previous steps
  function( err ) {
    null;
  }
);