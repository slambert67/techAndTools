import { default as express } from 'express';
import { router as indexRouter } from './routes/index.mjs';
import * as http from 'http';
import * as path from'path';

export const app = express();

// view/templating engine setup - npm install hbs
app.set('view engine', 'hbs');  // template engine to use
app.set('views', './views');    // specify where templates reside

// Router function lists
app.use('/', indexRouter);

export const server = http.createServer(app);
server.listen(3000);