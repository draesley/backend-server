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

exports.checkAdmin = function(req, res, next) {

    var user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mesage: 'token not valid-not is Admin',
            errors: err
        });
    }
};

// verifica admin o mi mismo
exports.checkAdmin_o_Yourself = function(req, res, next) {

    var user = req.user;
    var id = req.params.id;

    if (user.role === 'ADMIN_ROLE' || user.id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mesage: 'token not valid-not is Admin',
            errors: { message: 'no es administrador o el mismo usuario' }
        });
    }
};