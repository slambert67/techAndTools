const express = require('express');
const v1 = require('./routes/v1');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
}

app.use( cors(corsOptions) );

// service
app.use(express.json());


// V1 API
app.use('/v1', v1);

module.exports = app;
