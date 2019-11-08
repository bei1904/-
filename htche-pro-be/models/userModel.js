const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    'userphone': String,
    'psw': String,
    'checkcode': String,
});
const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;