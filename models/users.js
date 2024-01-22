const mongoose = require('mongoose')

const userShema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        index:{ unique:true }
    },
    email: {
        type: String,
        require: true,
        index:{ unique:true }
    },
    password: {
        type: String,
        require: true
    },
    avater: {
        type: String
    },
},{
    timestamps:true
})

const users = mongoose.model.users || mongoose.model('users',userShema)

module.exports = users