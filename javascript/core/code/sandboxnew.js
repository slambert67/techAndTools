const sandboxnewApi = ( () => {






/**
 * Custom implementation of Promise.all
 * Takes an array of promises (or values) and returns a new promise
 * that resolves when all input promises have resolved,
 * or rejects immediately if any promise rejects.
 *
 * @param {Array<Promise|any>} promises - Array of promises or values
 * @returns {Promise<Array>} - Promise that resolves to an array of results
 */
function myAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];   // Array to store resolved values in order
    let completed = 0;    // Counter for how many promises have resolved

    // Iterate through each promise
    promises.forEach((p, i) => {
      // Ensure p is a promise (wraps non-promise values)
      Promise.resolve(p)  // keeps async behaviour if p is a promise
        .then(val => {
          results[i] = val;     // Store result at correct index
          completed++;          // Increment completed counter

          // If all promises have completed, resolve the outer promise
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject); // If any promise rejects, reject the outer promise immediately
    });
  });
}







    return {func};
})();

console.log(sandboxnewApi.func([
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1']
]));


/*
a   b   c   a   b   c   d

-
a:0
b:1
c:2
a - repeat. length = 3 so far
a:3
*/