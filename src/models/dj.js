const mongoose = require('mongoose');

let Dj = new mongoose.Schema({
    Guild : {
        type: String,
        required: true
    },
    Roles : {
        type: Array,
        default: null
    }, 
    Mode: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('dj', Dj);
