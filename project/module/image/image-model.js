var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ImageSchema = new Schema({
  url: {type: String, required: true},
  createdUserId: {type: String, required: true},
  deleted: {type: Boolean, default: false}
}, { timestamps: { createdAt: 'createdAt'}})

module.exports = mongoose.model('Image', ImageSchema)
