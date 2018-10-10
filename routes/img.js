var express = require('express');

var app = express();
//enlasa la ruta de asset
const path = require('path');
const fs = require('fs');

//rutas
app.get('/:type/:img', (req, res, next) => {

    var type = req.params.type;
    var img = req.params.img;

    var pathImg = path.resolve(__dirname, `../upload/${type}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var notImg = path.resolve(__dirname, `../assets/img/notimg.jpg`);
        res.sendFile(notImg);
    }
});

module.exports = app;