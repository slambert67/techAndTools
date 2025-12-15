const interview = ( () => {

    //////////////////////////////////////////////////////
    // Private functions
    /////////////////////////////////////////////////////



    //////////////////////////////////////////////////////
    // Public Interface
    /////////////////////////////////////////////////////

    /*
"/a/b/../c//./" → "/a/c"
    */

    function simplifyPath(path) {
        const parts = path.split('/'); // split by slash
        const stack = [];

        console.log(parts);
        for (let part of parts) {
            if (part === '' || part === '.') {
                // skip empty or current directory
                continue;
            } else if (part === '..') {
                // go up one directory, if possible
                if (stack.length > 0) stack.pop();
            } else {
                // normal directory name
                stack.push(part);
            }
        }
        console.log('/' + stack.join('/'));
        return '/' + stack.join('/');
    }

    // Example




    function sandbox() {
    }


    // return public interface
    return {simplifyPath, sandbox};
})();

interview.simplifyPath( "/a/b/../c//./" );
//interview.simplifyPath( "/../" );
//interview.simplifyPath( "/home//foo/" );
//interview.sandbox();