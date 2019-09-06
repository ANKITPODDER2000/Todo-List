var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    todo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo',
        }
    ]
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
