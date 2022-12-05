const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', (req,res) => {
    //res.send('<h1>Hello world!!</h1>');

    res.writeHead( 200, {
        "Content-Type": "application/json"
    });
    res.end( JSON.stringify( {error: null} ) + "\n" );
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
