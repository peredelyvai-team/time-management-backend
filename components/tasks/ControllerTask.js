var Task = require('./ModelTask')
var ObjectID = require('mongodb').ObjectID;

exports.createTask = async (task) => {
	return await Task.create(task)
}

exports.getUsersTasks = async (owner) => {
	return await Task.find(owner)
}

exports.updateTask = async (id, task) => {
	const result = await Task.updateOne({ _id: ObjectID(id) }, task)
	return result.nModified
}

exports.deleteTask = async (id) => {
	const result = await Task.findByIdAndDelete(id)
	console.log(result)
	return result
}


