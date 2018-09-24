var http = require('http');
var fs   = require('fs');

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
  
    if (req.url == '/albums.json') {
        handle_list_albums(req, res);
    } else if ( req.url.substr(0,7) == '/albums' &&
                req.url.substr(req.url.length-5) == '.json') {
        handle_get_album(req, res);                
    } else {
        console.log("sending failure");
        send_failure(res, 404, invalid_resource());
    }    
}

function handle_list_albums(req, res) {
    // format of request is /albums.json
    console.log("listing albums");
    load_album_list( function(err, albums) {
        if (err) {
            send_failure(res, 500,err);
            return;
        }
        send_success(res, {albums: albums});
    });
}

function load_album_list( callback ) {
    // callback returns error or JSON response
    
    fs.readdir(
        "albums",  // directory name
        function(err, files) {  // files contains directories
            if (err) {
                // return error
                callback( make_error("file_error", JSON.stringify(err)));
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
                            callback(make_error("file_error", JSON.stringify(err)));
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

function handle_get_album(req, res) {
    console.log("getting album");
    // format of request is /albums/album_name.json
    var album_name = req.url.substr(7, req.url.length-12);
    load_album(
        album_name,
        function(err, album_contents) {
            if (err && err.error == "no_such_album") {
                send_failure(res, 404, err);
            } else if (err) {
                send_failure(res, 500, err);
            } else {
                send_success(res, {album_data: album_contents});
            }        
    });    
}

function load_album(album_name, callback) {
    fs.readdir(
        "albums/" + album_name,
        function(err, files) {
            if (err) {
                if (err.code == "ENOENT") {
                    callback(no_such_album());
                } else {
                    callback( make_error("file_error",
                                          JSON.stringify(err)) );
                }
                return;
            }
            
            var only_files = [];
            var path = "albums/" + album_name + "/";
            
            (function iterator(index) {
                if (index == files.length) {
                    var obj = {short_name: album_name,
                               photos: only_files};
                    callback(null, obj);
                    return;
                }
                
                fs.stat(
                    path + files[index],
                    function(err, stats) {
                        if (err) {
                            callback(make_error("file_error",
                                                JSON.stringify(err)));
                            return;
                        }
                        if (stats.isFile()) {
                            var obj = { filename: files[index],
                                        desc: files[index]};
                            only_files.push(obj);                                        
                        }
                        iterator(index+1);
                    }
                );
            })(0);
        }
    );    
}

function send_success(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"} );
    var output = {error: null, data: data};
    res.end(JSON.stringify(output) + "\n");    
}

function send_failure(res, code, err) {
    var code = (err.code) ? err.code : err.name;
    console.log("code = " + code);
    code = 404;
    res.writeHead(code, {"Content-Type": "application/json"});
    res.end( JSON.stringify( {error: code, message: err.message} ) + "\n" );
}


function invalid_resource() {
    return make_error( "invalid_resource",
                       "the requested resource does not exist" );
}

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

function no_such_album() {
    return make_error("no_such_album",
                      "The specified album does not exist");
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);