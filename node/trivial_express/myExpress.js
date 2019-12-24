var express = require('express');
var app = express();

// this is the only layer in the sequence
// helper function provided by express
// executed if - HTTP request method is GET
//             - url is /
app.get('/', function(req,res) {
  res.end('hello world');
});

app.listen(8080);