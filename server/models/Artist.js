const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

module.exports = mongoose.model('Artist', ArtistSchema);