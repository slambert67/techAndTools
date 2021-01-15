// simple express server
// middleware - function that has access ro req, res

const express = require('express');
const path = require('path');  // handle file paths
const exphbs = require('express-handlebars');
const members = require('./Members');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware function


// Initialise logger middleware
//app.use(logger);  // logger now invoked for each request - I think

// app.use => I want every request to be run through this function

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'})); // filename of main.handlebars
app.set('view engine', 'handlebars');

// Initialize body parser middleware
app.use( express.json() );

// Initialize form submissions - middleware
app.use( express.urlencoded({extended: false}) );

// home page route - overrides static below
app.get('/', (req,res) => res.render('index', {title: 'Member App', members: members}));



// create routes / endpoints - all have access to req res objects
/*app.get('/', (req,res) => {
    // res.json
    // res.render
    //res.send('<h1>Hello world!!</h1>');
    res.sendFile( path.join(__dirname, 'public', 'index.html') ); // __dirname: current directory
});*/
// don't want to continually specify public - so use middleware to define static folder

// set static folder -  works with just this
// '/'           => index.html
// '/about.html' => about .html
app.use( express.static( path.join(__dirname, 'public') ) ); 

// moved to separate file
// separate file uses router instead of app. Not sure why?
// get all members
/*app.get('/api/members', (req,res) => {
    res.json(members); // takes care of stringify
});

// get single member
app.get('/api/members/:id', (req,res) => {
    //res.send(req.params.id); // id retrieved from url

    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found) {
        res.json( members.filter(member => member.id === parseInt(req.params.id)) ); // status: 200
    } else {
        res.status(400).json( {msg:`No member with the id of ${req.params.id}`} );
    }

});*/

// Members API Routes
app.use('/api/members', require('./routes/api/members'));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));