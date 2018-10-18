var express = require('express');
var jwt = require('jsonwebtoken');

var app = express();

var Hospital = require('../models/hospital');
var mdCheck = require('../middleware/authentication');

//rutas

app.get('/:id', (req, res) => {

    var id = req.params.id;
    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err, hospital) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mesage: 'error loading hospital',
                    errors: err
                });
            }

            if (!hospital) {
                res.status(400).json({
                    ok: false,
                    mesage: 'error hospital not exist!!!',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospital,
            });
        })
});

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .exec((err, hospitales) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mesage: 'error loading hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, tell) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    conteo: tell
                });
            });
        });
});

//create new hospital
app.post('/', mdCheck.checkToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save((err, hospitalSave) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mesage: 'error create hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSave
        });
    });
});

//update hospital
app.put('/:id', mdCheck.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error search hospital',
                errors: err
            });
        };

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'error hospital null',
                errors: { message: 'there is no hospital with that id' }
            });
        };

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, hospitalSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error update hospital',
                    errors: err
                });
            };

            res.status(200).json({
                ok: true,
                hospital: hospitalSave
            });
        });
    });
});

//delete hospital
app.delete('/:id', mdCheck.checkToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error delete user',
                errors: err
            });
        };

        if (!hospitalDelete) {
            return res.status(400).json({
                ok: false,
                message: 'error hospital does not exist',
                errors: { message: 'hospital does not exist' }
            });
        };

        res.status(200).json({
            ok: true,
            hospital: hospitalDelete
        });
    });
});

module.exports = app;