var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var doctorSchema = new Schema({
    name: { type: String, required: [true, 'this name is necesary'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'hospital', required: [true, 'this hospital is required'] }
});

module.exports = mongoose.model('doctor', doctorSchema);