var mongoose = require('mongoose')
var Token = new mongoose.Schema({
	refresh_token: {
		type: String,
		required: true,
	}
})

module.exports = mongoose.model('Token', Token )