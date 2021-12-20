import { default as restify } from 'restify';

let server = restify.createServer();

server.listen(3000, function () {
    console.log('ready on %s', server.url);
});