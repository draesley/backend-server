var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');

app.use(fileUpload());
// limits: { fileSize: 50 * 1024 * 1024 },
//}));

//rutas
app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // verificar tipos de coleciones
    var typesValid = ['users', 'hospitales', 'doctors'];
    if (typesValid.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            mesage: 'error the type collection not valid',
            errors: { message: 'error the type collection not valid' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mesage: 'error loading image',
            errors: { message: 'you must select an image' }
        });
    }

    //obtener nombre del archivo
    var archive = req.files.image;

    var searchExt = archive.name.split('.');
    //extension
    var extension = searchExt[searchExt.length - 1];

    //validar extensiones
    var validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mesage: 'error not valid extension' + extension,
            errors: { message: 'selected valid extension' + validExtensions.join(', ') }
        });
    }

    // nombre del archivo personalizado
    var nameArchive = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //mover archivo
    var path = `./upload/${type}/${nameArchive}`;

    archive.mv(path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesage: 'error when moving archive',
                errors: err
            });
        };

        uploadByType(type, id, nameArchive, res)


    });

});

function uploadByType(type, id, nameArchive, res) {

    if (type === 'users') {

        User.findById(id, (err, user) => {

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mesage: 'user not exist',
                    errors: { message: 'This user not exist' }
                });
            }

            var oldPath = '../upload/users/' + user.img;
            //borrar la img vieja
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            user.img = nameArchive;

            user.save((err, userUpdate) => {

                userUpdate.password = ';)';

                return res.status(200).json({
                    ok: true,
                    mesage: 'image user update',
                    user: userUpdate
                });
            });
        });
    };

    if (type === 'doctors') {

        Doctor.findById(id, (err, doctor) => {

            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    mesage: 'doctor not exist',
                    errors: { message: 'This doctor not exist' }
                });
            };

            var oldPath = '../upload/doctors/' + doctor.img;
            //borrar la img vieja
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            doctor.img = nameArchive;

            doctor.save((err, doctorUpdate) => {

                return res.status(200).json({
                    ok: true,
                    mesage: 'image doctor update',
                    doctor: doctorUpdate
                });
            });
        });
    };

    if (type === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mesage: 'hospital not exist',
                    errors: { message: 'This doctor not exist' }
                });
            };

            var oldPath = '../upload/hospitales/' + hospital.img;
            //borrar la img vieja
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = nameArchive;

            hospital.save((err, hospitalUpdate) => {

                return res.status(200).json({
                    ok: true,
                    mesage: 'image hospital update',
                    hospital: hospitalUpdate
                });
            });
        });
    };

}

module.exports = app;