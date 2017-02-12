var mongoose = require('mongoose')
var Schema = mongoose.Schema
var STATUS_PENDING = require('./image-constants').STATUS_PENDING

var ImageSchema = new Schema({
  url: {type: String, required: true},
  createdUserId: {type: String, required: true},
  gender: String,
  status: {type: String, default: STATUS_PENDING},
  deleted: {type: Boolean, default: false}
}, { timestamps: { createdAt: 'createdAt'}})

module.exports = mongoose.model('Image', ImageSchema)
