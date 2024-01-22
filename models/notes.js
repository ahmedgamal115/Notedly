const mongoose = require('mongoose')

const noteShema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    favoriteCount:{
        type: Number,
        default: 0
    },
    favoritedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },

},
{
    timestamps: true
}
)

const Notes = mongoose.model.notes || mongoose.model('notes',noteShema)

module.exports = Notes