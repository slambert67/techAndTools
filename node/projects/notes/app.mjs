import { default as express } from 'express';
import { router as indexRouter } from './routes/index.mjs';
import { default as hbs } from'hbs';
import * as http from 'http';
import * as path from'path';

import { default as dotenv } from 'dotenv';
dotenv.config();

import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;

import {
    normalizePort, onError, onListening, handle404, basicErrorHandler
} from './appsupport.mjs';

import { InMemoryNotesStore } from './models/notes-memory.mjs';
export const NotesStore = new InMemoryNotesStore();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// view/templating engine setup - npm install hbs
app.set('view engine', 'hbs');                           // template engine to use
app.set('views', path.join(__dirname, 'views'));         // specify where templates reside
hbs.registerPartials(path.join(__dirname, 'partials'));  // specify where partial templates reside

// Router function lists
app.use('/', indexRouter);

// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);
export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);