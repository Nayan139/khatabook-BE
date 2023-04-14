const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    firstname:{
        type: String,
        trim: true,
        required:true
    },
    lastname: {
        type: String,
        trim: true,
        required:true
    },
    email: {
        type: String,
        trim: true,
        required:true
    },
    password: {
        type: String,
        trim: true,
        required:true
    },
    mobileno: {
        type: String,
        trim: true,
    },
    
}, {
    timestamps:true
})

const User = mongoose.model('User', userSchema)
module.exports = User