var http = require("http");  // commonJS

function process_request( req, res ) {

    // req is a ServerRequest object provide by http module
    // res is a ServerResponse object provide by http module - check

    console.log("INCOMING REQUEST: " + req.method + " " + req.url);

    var body           = 'hello world';
    var content_length = body.length;

    res.writeHead( 200, { 'Content-Length': content_length,
                          'Content-Type': 'text/plain'} );
    res.end(body);

    //console.log(req);

}  

// create the server
var s = http.createServer( process_request );
s.listen(8080);