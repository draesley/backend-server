const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/authentication');

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.post('/', (req, res) => {

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aldemar56@gmail.com',
            pass: 'aldemar1982'
        }
    });

    var mailOptions = {
        from: req.body.name, //quien envia
        to: req.body.email, // destinatario
        subject: req.body.affair,
        text: req.body.message,

    }

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('email send ok');
            res.status(200).json({
                ok: true,
                message: info
            });
        }
    })
})

module.exports = app;