const express = require('express');
const oracledb = require('oracledb');
var cors = require('cors');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// home page route - overrides static below
//app.get('/x/y', (req,res) => res.send('<h1>hello world</h1>'));

/*app.get('/x/y', (req,res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Hi There!');
    res.end();
}
);*/

app.get('', (req,res) => {
	res.json({msg: 'squoink'});
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));