//require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//init var
var app = express();

//para definir origenes  cors

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//config body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//import routes
var appRoutes = require('./routes/app');
var usersRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var doctorRouter = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imgRoutes = require('./routes/img');

//conection db
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
    if (err) throw err;
    console.log('Conect Base Mongoon :\x1b[32m%s\x1b[0m', 'online');
});


//server index config opcional para imagenes
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/upload')); */




//routes
app.use('/user', usersRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRouter);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imgRoutes);
app.use('/', appRoutes);

//server
app.listen(3000, () => {
    console.log('express server run in port 3000:\x1b[32m%s\x1b[0m', 'online');
});