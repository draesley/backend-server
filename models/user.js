var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} It is not a valid role'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'user name is required'] },
    email: { type: String, unique: true, required: [true, 'user emial is required'] },
    password: { type: String, required: [true, 'user pasword is required'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidator }
});

userSchema.plugin(uniqueValidator, { message: '{PAHT}the mail must be unique' })

module.exports = mongoose.model('user', userSchema);