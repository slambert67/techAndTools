import { default as express } from 'express';
import { router as indexRouter } from './routes/index.mjs';
import * as http from 'http';
import { default as dotenv } from 'dotenv';
dotenv.config();

export const app = express();

// Router function lists
app.use('/', indexRouter);

export const server = http.createServer(app);
server.listen(process.env.PORT);