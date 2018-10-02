var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

//rutas
//========== busqueda especifica =========
app.get('/collection/:table/:search', (req, res) => {

    var search = req.params.search;
    var table = req.params.table;
    var regex = new RegExp(search, 'i');

    var promise;

    switch (table) {
        case 'users':
            promise = searchUsers(search, regex);
            break;
        case 'doctors':
            promise = searchDoctor(search, regex);
            break;
        case 'hospitales':
            searchHospitales(search, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'the valid search is users, doctors, hospitales',
                error: { message: 'type table not valict' }
            });
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    })
});


app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    //expresion para que la palabra recibidad sea insencible y pueda ejecutar la busqueda
    var regex = new RegExp(search, 'i');

    //para buscar por medio de una promesa las collection
    //========== busqueda general =========
    Promise.all([
            searchHospitales(search, regex),
            searchDoctor(search, regex),
            searchUsers(search, regex)
        ])
        .then(answers => {
            res.status(200).json({
                ok: true,
                hospitales: answers[0],
                doctors: answers[1],
                users: answers[2]
            });
        });
});

function searchHospitales(search, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email') //determina quien creo los hospitales
            .exec((err, hospitales) => {
                if (err) {
                    reject('error when loading hospitals', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
};

function searchDoctor(search, regex) {

    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospitale')
            .exec((err, doctors) => {
                if (err) {
                    reject('error when loading doctors', err);
                } else {
                    resolve(doctors);
                }
            });
    });
};

function searchUsers(search, regex) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name email')
            .or([
                { 'name': regex },
                { 'email': regex }
            ])
            .exec((err, users) => {
                if (err) {
                    reject('error when loading doctors', err);
                } else {
                    resolve(users);
                }
            });
    });
};

module.exports = app;