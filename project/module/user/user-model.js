var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  loginId: {type: String, required: true, unique: true},
  phone: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  isAdmin: {type: Boolean, required: true, default: false},
  emailResetId: String,
  deleted: {type: Boolean, default: false}
}, {strict: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

module.exports = mongoose.model('User', userSchema)
