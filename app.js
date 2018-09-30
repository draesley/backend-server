//require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//init var
var app = express();

//config body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//import routes
var appRoutes = require('./routes/app');
var usersRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

//conection db
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
    if (err) throw err;
    console.log('Conect Base Mongoon :\x1b[32m%s\x1b[0m', 'online');
});

//routes
app.use('/user', usersRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//server
app.listen(3000, () => {
    console.log('express server run in port 3000:\x1b[32m%s\x1b[0m', 'online');
});