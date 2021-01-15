var http = require('http');
var fs   = require('fs');
var path = require('path');

// format of request: /content/file.html
function handle_incoming_request(req, res) {
    console.log(req.method.toLowerCase());
    console.log(req.url.substring(0,9));
    if ( req.method.toLowerCase() == 'get' 
         && req.url.substring(0,9) == '/content/') {
        serve_static_file(req.url.substring(9), res);
    } else {
        res.writeHead(404, {"Content-Type": "application/json"} );
        var out = { error: "not_found",
                    message: "'" + req.url + "' not found"};
        res.end( JSON.stringify(out) + "/n" );            
    }
}

/**
 * res is ServerResponse object and is a stream to which output can be written
 */
function serve_static_file(file, res) {
    var rs = fs.createReadStream(file);
    var ct = content_type_for_path(file);
    res.writeHead(200, { "Content-Type" : ct });

    rs.on('error', (e) => {
        res.writeHead(404, { "Content-Type" : "application/json" });
        var out = { error: "not_found",
                    message: "'" + file + "' not found" };
        res.end(JSON.stringify(out) + "\n");
        return;
    });

    rs.on('readable', () => {
        var d = rs.read();
        if (d) {
            res.write(d);
        }
    });

    rs.on('end', () => {
        res.end();  // we're done!!!
    });
}

function content_type_for_path (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        default: return 'text/plain';
    }
}    

var s = http.createServer(handle_incoming_request);
s.listen(8080);
