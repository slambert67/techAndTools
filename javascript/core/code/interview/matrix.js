const sandboxAPI = ( () => {


    function isEqual( targetEntry, matrixEntry ) {
        return true;
    }


    function isSparse(arr) {

        // ['a, 'b', 'c', 'd'] vs ['a', 'b', , 'd'] - different sets of indices

        const sparse = [ ...Array(arr.length).keys()].some( (element, index) => {
            return !(index in arr)
        });

        return sparse;

    }


    function is2dArray(arr) {
        return Array.isArray(arr) && arr.every( (el) => { return Array.isArray(el)});
    }


    function preConditionsMet( target, matrix ) {

        // target is 2d array
        if ( !is2dArray(target) ) {
            console.log('target is not a 2d array');
            return false;
        }

        // matrix is 2d array
        if ( !is2dArray(matrix) ) {
            console.log('matrix is not a 2d array');
            return false;
        }

        // target is not sparse
        /*if ( isSparse(target) ) {
            console.log('target is sparse');
            return false;
        }*/


        // matrix is not sparse
        if ( isSparse(matrix) ) {
            console.log('matrix is sparse');
            return false;
        }

        // number of target columns <= number of matrix columns

        // number of target rows    <= number of matrix rows

        return true;

    }


    // top level function
    function searchMatrix( target, matrix ) {

        // ensure appropriate preconditions
        if ( !preConditionsMet( target, matrix ) ) {
            console.log('Preconditions not met');
            return;
        }
        console.log('Preconditions met');

        // data cleanse

        // main algorithm
    }

    return { searchMatrix }
})();

sandboxAPI.searchMatrix([['a', 'b', 'd']], [['a', 'b', 'd']]);


