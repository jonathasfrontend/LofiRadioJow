const mongoose = require('mongoose');

let autoReconnect = new mongoose.Schema({
    Guild : {
        type: String,
        required: true
    },
    TextId : {
        type: String,
        required: true
    },
    VoiceId : {
        type: String,
        required: true
    }, 
});
module.exports = mongoose.model('autoreconnect ', autoReconnect );