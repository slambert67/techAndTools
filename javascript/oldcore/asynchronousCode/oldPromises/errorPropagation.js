// when one promise is rejected - all subsequent promise are rejected
Promise.reject( Error('promise rejected') )  // return error object
// this then code never runs. Only executed when parent Promise is fulfilled
.then( function() {
         console.log('promise fulfilled');
       }
)
// catch used instead of registering 2nd function in 'then' as reject handler
.catch( function(e) {
          console.log('Error - see below');
          console.log(e);
          // rejection not propagated further unless 'throw' is invoked
        }
)