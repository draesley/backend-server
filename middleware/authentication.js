var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


exports.checkToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mesage: 'token not valid',
                errors: err
            });
        }

        req.user = decoded.user;
        /* res.status(200).json({
            ok: true,
            decoded: decoded
        }); */
        next();
    });
};