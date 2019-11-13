var http = require("http"); // allows program to act as web server

function process_request(req, res) {

  var body = 'Thanks for calling\n';
  var content_length = body.length;
  
  // construct response
  res.writeHead( 200, {
    'Content-Length': content_length,
    'Content-Type': 'text/plain'
  });
  res.end(body);
}

// takes 1 argument. Function to be called on each request
var s = http.createServer(process_request);
s.listen(8080);
