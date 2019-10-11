var http = require('http'),
    fs = require('fs');

function load_album_list(callback) {

  fs.readdir(
    "albums",
    function(err, files) {
      if (err) {
        callback(err);
        return;
      }
      // success
      callback(null, files);
    }
  );
}

function handle_incoming_request(req, res) {
  console.log("INCOMING REQUEST: " + req.method + " " + req.url);

  load_album_list( function(err, albums) {  // my standard. Include err as 1st parameter
    
    if (err) {
      res.writeHead( 503, {"Content-Type":"application/json"} );
      res.end( JSON.stringify(err) + "\n" );
      return;
    }

    // success
    var out = { error: null,
                data: { "albums": albums } };
    res.writeHead( 200, {"Content-Type":"application/json"} );
    res.end( JSON.stringify(out) + "\n" );    
  });
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);