// express
const express  = require('express');
const app = express();

// oracle
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const PORT = process.env.PORT || 8080;

async function run(res) {

    let connection;

    try {
        console.log('try');
        connection = await oracledb.getConnection({
            user            : 'ultraproxy[ops$aims]',
            password        : 'quilt1',
            connectString   : '141.196.100.144:1521/AIMS-PC1503.ultra-as.net'
        });

        const result = await connection.execute(
            `SELECT icao_code,name
             FROM airlines
             WHERE rownum < 21`
          );
          //console.log(result.rows[1]);
          res.json(result.rows);

    } catch (err) {
        console.log(err);
    } finally {
        console.log('finally');
    }
}

app.get('/', (req,res) => {
    run(res);
    //res.send('<h1>Hello world!!</h1>');
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));