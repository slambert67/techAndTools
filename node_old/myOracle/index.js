const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {

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
             FROM airlines`
          );
          console.log(result.rows);

    } catch (err) {
        console.log(err);
    } finally {
        console.log('finally');
    }
}

run();