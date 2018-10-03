var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var app = express();

var userModel = require('../models/user');
var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;

//google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//autenticacion de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
verify().catch(console.error);


app.post('/google', async(req, res, next) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                message: 'token not valid!!!'
            });
        });

    userModel.findOne({ email: googleUser.email }, (err, userDb) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mesage: 'error seacherd user',
                errors: err
            });
        }

        if (userDb) {
            if (userDb === false) {
                res.status(400).json({
                    ok: false,
                    message: 'you must use your normal authentication!!!'
                });
            } else {
                var token = jwt.sign({ user: userDb }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    user: userDb,
                    token: token,
                    id: userDb._id
                });
            }
        } else {
            //el usuario no existe hay que crearlo
            user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ';)';

            user.save((err, userDb) => {
                var token = jwt.sign({ user: userDb }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    user: userDb,
                    token: token,
                    id: userDb._id
                });
            });
        }
    });

    /* res.status(200).json({
        ok: true,
        message: 'este es google!!!',
        googleUser: googleUser
    }); */
});


//autenticacion normal
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