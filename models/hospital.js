var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    name: { type: String, required: [true, 'this name is necesary'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
}, { collection: 'hospitales' });

module.exports = mongoose.model('hospital', hospitalSchema);