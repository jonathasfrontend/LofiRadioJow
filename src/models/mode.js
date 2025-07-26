const mongoose = require('mongoose');

let mode = new mongoose.Schema({
    Guild : String,
    mode : String, 
    oldmode: String,
})

module.exports = mongoose.model('mode', mode);