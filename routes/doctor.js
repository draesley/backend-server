var express = require('express');
var jwt = require('jsonwebtoken');

var app = express();

var Doctor = require('../models/doctor');
var mdCheck = require('../middleware/authentication');

//rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Doctor.find({})
        .skip(desde)
        .limit(5)
        .populate('user', 'name email') //adicionar img si hay problemas
        .populate('hospital')
        .exec((err, doctors) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mesage: 'error loading doctor',
                    errors: err
                });
            }

            Doctor.count({}, (err, tell) => {
                res.status(200).json({
                    ok: true,
                    doctors: doctors,
                    conteo: tell
                });
            });
        });
});

//================
// trae un doctor
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Doctor.findById(id)
        .populate('user', 'name email img')
        .populate('hospital')
        .exec((err, doctor) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                doctor: doctor
            });
        })
})

//create new hospital
app.post('/', mdCheck.checkToken, (req, res) => {
    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((err, doctorSave) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mesage: 'error create doctor',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: doctorSave
        });
    });
});

//update hospital
app.put('/:id', mdCheck.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, doctor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error search doctor',
                errors: err
            });
        };

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'error doctor null',
                errors: { message: 'there is no doctor with that id' }
            });
        };

        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save((err, doctorSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error update doctor',
                    errors: err
                });
            };

            res.status(200).json({
                ok: true,
                doctor: doctorSave
            });
        });
    });
});

//delete hospital
app.delete('/:id', mdCheck.checkToken, (req, res) => {

    var id = req.params.id;

    Doctor.findByIdAndDelete(id, (err, doctorDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error delete doctor',
                errors: err
            });
        };

        if (!doctorDelete) {
            return res.status(400).json({
                ok: false,
                message: 'error doctor does not exist',
                errors: { message: 'doctor does not exist' }
            });
        };

        res.status(200).json({
            ok: true,
            doctor: doctorDelete
        });
    });
});

module.exports = app;