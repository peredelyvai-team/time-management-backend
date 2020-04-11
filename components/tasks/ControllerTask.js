var Task = require('./ModelTask')

exports.createTask = async (task) => {
	return await Task.create(task)
}

exports.getUsersTasks = async (owner) => {
	return await Task.find(owner)
}