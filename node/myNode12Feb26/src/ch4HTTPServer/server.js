// @ts-check

import * as http from 'http';
import * as util from 'util';
import * as os from 'os';

const listenOn = 'http://localhost:8124';
const server = http.createServer();

// handle request event
server.on( 'request', (req, res) => {

    // req.url is just the path - not a valid absolute url
    // inputs:  req.url → relative URL (e.g. /osinfo?x=1)
    //          listenOn → base URL
    // result:  URL object representing http://localhost:8124/osinfo?x=1
    /*
        requrl.href      // full URL
        requrl.pathname  // "/osinfo"
        requrl.search    // "?x=1"
        requrl.searchParams.get('x') // "1"
        requrl.host      // "localhost:8124"
        requrl.protocol  // "http:"

    */
    // Think of new URL() as: “Take this possibly incomplete URL, resolve it against a base, and give me a safe, structured object.”
    var requrl = new URL(req.url, listenOn);

    // request routing
    if (requrl.pathname === '/') {
        homePage(req, res);
    } else if (requrl.pathname === '/osinfo') {
        osInfo(req, res);
    } else {
        res.writeHead(404, {'content-type': 'text/html'});
        res.end('bad URL ' + req.url);
    }
});

server.listen( new URL(listenOn).port );
console.log(`Listening to ${listenOn}`);


function homePage(req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('homepage');   
}

function osInfo(req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('osinfo');   
}