var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    tittle: String,
    description: String,
    startdate: String,
    deadline : String
})

module.exports = new mongoose.model('Todo', todoSchema);