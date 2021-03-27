import { default as express } from 'express';
import { default as hbs } from'hbs';
import { router as indexRouter } from './routes/index.mjs';
import * as http from 'http';
import * as path from'path';

export const app = express();

// view/templating engine setup - npm install hbs
app.set('view engine', 'hbs');           // template engine to use
app.set('views', './views');             // specify where templates reside
hbs.registerPartials('./partials', (err) => { console.log(err);});  // Handlebars allows for template reuse through partials. Partials are normal Handlebars templates that may be called directly by other templates

// Router function lists
app.use('/', indexRouter);

export const server = http.createServer(app);
server.listen(3000);