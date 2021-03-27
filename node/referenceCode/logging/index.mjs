import { default as express } from 'express';
import { default as logger } from 'morgan';
import * as http from 'http';


export const app = express();


app.use(logger('tiny'));

app.get('/', (req,res) => {
    console.log('hello world');
    res.end();
});

export const server = http.createServer(app);

server.listen(3000);

