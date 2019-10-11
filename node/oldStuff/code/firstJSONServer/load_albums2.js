/**
 * Added functionality to filter out files when requiring list of directories
 */
 
var http = require('http');
var fs   = require('fs');

/**
( function iterator(i) {
      if (i<5) {
          console.log("in iterator"); 
          i++; 
          iterator(i);          
      } else {
          return;
      }
 
})(0);
 */
 
function load_album_list( callback ) {
    // callback returns error or JSON response
    
    fs.readdir(
        "albums",  // directory name
        function(err, files) {  // files contains directories
            if (err) {
                // return error
                callback(err);
                return;
            }
            
            // return JSON response
            var only_dirs = [];
            (function iterator(index) {
                // if all directories processed
                if (index == files.length) {
                    callback(null, only_dirs);
                    return;
                }
                
                // process directory
                fs.stat(
                    "albums/" + files[index],  // filename
                    // callback checks if file is a directory
                    function(err, stats) {
                        if (err) {
                            callback(err);
                            return;
                        }   
                        if (stats.isDirectory()) {
                            only_dirs.push(files[index]);
                        }
                        iterator(index+1);                       
                    }
                )               
            }
            )(0);
        }
    );      
}

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    
    // callback returns error or JSON response 
    load_album_list( function(err, albums) {
        if (err) {
            res.writeHead(503, {"Content-Type": "application/json"});
            res.end(JSON.stringify(err) + "\n");
            return;
        }
        
        // why no quotes on json key?
        var out = {
            error: null,
            data: { albums: albums }
        }
        res.writeHead(200, { "Content-Type" : "application/json"}); 
        res.end(JSON.stringify(out) + "\n");        
    });
;
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);