var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var app = express();

var userModel = require('../models/user');
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    userModel.findOne({ email: body.email }, (err, userDb) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mesage: 'error seacherd user',
                errors: err
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                mesage: 'incorrect credentials',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                mesage: 'incorrect password',
                errors: err
            });
        }

        //crear un token
        userDb.password = ';)';
        var token = jwt.sign({ user: userDb }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: userDb,
            token: token,
            id: userDb._id
        });
    });
});

module.exports = app;