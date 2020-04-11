var mongoose = require('mongoose')
var User = new mongoose.Schema({
  username: {
    type: String,
	  required: true,
  },
	email: {
  	type: String,
		required: true,
		unique: true
	},
	password: {
  	type: String,
		required: true
	},
	level: {
  	type: Number,
		required: false
	},
	progress: {
  	type: Number,
		required: false
	}
})

module.exports = mongoose.model('User', User )