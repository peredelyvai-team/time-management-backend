var mongoose = require('mongoose')
var Task = new mongoose.Schema({
	owner: {
		required: true,
		type: String,
		ref: 'User'
	},
	name: {
		required: false,
		type: String
	},
	description: {
		required: false,
		type: String
	},
	important: {
		required: false,
		type: Boolean
	},
	urgent: {
		required: false,
		type: Boolean
	},
	status: {
		required: false,
		type: Boolean
	},
	currentDuration: {
		required: false,
		type: Number
	},
	lastUpdated: {
		required: false,
		type: Date,
		default: new Date ()
	},
	cycles: {
		required: false,
		type: Number
	}
})

const Model = mongoose.model('Task', Task )
Model.createCollection()
module.exports = Model