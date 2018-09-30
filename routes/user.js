var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var app = express();

var User = require('../models/user');

var mdCheck = require('../middleware/authentication');

//rutas
app.get('/', (req, res, next) => {

    User.find({}, 'name email img role')
        .exec((err, users) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mesage: 'error loading users',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                users: users
            });
        });
});





//create new user
app.post('/', mdCheck.checkToken, (req, res) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSave) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mesage: 'error create user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSave
        });
    });
});

//update user
app.put('/:id', mdCheck.checkToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error search user',
                errors: err
            });
        };

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'error user null',
                errors: { message: 'there is no user with that id' }
            });
        };

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error update user',
                    errors: err
                });
            };

            user.password = ';)';

            res.status(200).json({
                ok: true,
                user: userSave
            });
        });
    });
});

//delete user
app.delete('/:id', mdCheck.checkToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndDelete(id, (err, userDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error delete user',
                errors: err
            });
        };

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                message: 'error user does not exist',
                errors: { message: 'user does not exist' }
            });
        };

        res.status(200).json({
            ok: true,
            user: userDelete
        });
    });
});

module.exports = app;