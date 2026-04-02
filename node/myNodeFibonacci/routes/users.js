var express = require('express');
var router = express.Router();


/*
app.use('/users', usersRouter) mounts the router
Express strips /users before routing inside it
router.get('/') therefore matches /users
This enables router reuse and clean structure
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
