Promise.resolve('promise 1 return val')  // resolved so 'then' is executed
// each call to then returns a new promise
.then ( function step2(result) {  // result is output from previous step
          console.log('step2 received ' + result);
          return 'Greetings from step2';  // whatever is returned here resolves the promise so next 'then' is executed
                                          // explicit return value - this value resolves the promise
        }
)
.then ( function step3(result) {
          console.log('step3 received ' + result);  // no explicit return value.
                                                    // resolved promise still returned
        }
)
.then( function step4(result) {
         console.log('step4 received ' + result);  // undefined because no value returned.

         return Promise.resolve('fulfilled value');
       }
)
.then ( function step5(result) {
          console.log('step5 received ' + result);  // 'fulfilled value'
          return Promise.reject('promise rejected');
        }
)
.catch ( function catch1(e) {
           console.log('Error: ' + e);
         }
)