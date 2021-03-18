import { default as http } from 'http';

var server = http.createServer( (req, res) => {
    console.log('request received!');
    console.log(req.url);
    console.log(req.method);

    // plain text response
    if (req.url == '/text') {
        // response body
        var body = 'Hello world\n';
        var content_length = body.length;

        // response headers
        // 200:OK, 400:Bad request, 401:Unauthorized, 404:Not found
        res.writeHead( 200, {
            'Content-Length': content_length,
            'Content-Type': 'text/plain' // text/css, text/html, text/javascript, image/jpeg, application/json
        });
        res.end(body);  // MUST be called on each response
    }
    else if (req.url == '/html') {
        res.writeHead( 200, {
             'Content-Type': 'text/html' 
        });  
        res.write('<html>');
        res.write('<body>');
        res.write('<h1>Hello, World!</h1>');
        res.write('</body>');
        res.write('</html>');
        res.end();     
    }
    else if (req.url == '/json') {
        var body = {"a":1};
        res.writeHead( 200, {
            'Content-Type': 'application/json' 
        });
        res.end( JSON.stringify(body) ); 
    }
});
server.listen(3000);
