var express = require('express');
var router = express.Router();
var TaskApi = require('./ControllerTask')
var UserApi = require('../users/ControllerUser')
var { checkToken } = require('../../helpers/token')

router.get('/', checkToken, async (request, responce) => {
	const tasks = await TaskApi.getUsersTasks({ owner: request.query.uid })
	if (tasks) {
		responce.json(tasks)
	}
})

router.post('/create', checkToken, async (request, responce) => {
	const create = await TaskApi.createTask(request.body)
	console.log(create)
	if (create) {
		responce.sendStatus(200)
	} else {
		responce.sendStatus(500)
	}
})

router.put('/complete', checkToken, async (request, responce) => {
	const task = request.body
	const result = await TaskApi.updateTask(request.query.id, Object.assign({}, task, { status: 'completed' }))
	if (result) {
		var progress = await UserApi.updateProgress(request.query.uid, task)
		if (progress) {
			responce.sendStatus(200)
		} else {
			responce.status(500).send('Unable to update user\'s progress')
		}
	}	else {
		responce.status(500).send('Task is already completed')
	}
})

router.put('/update', checkToken, async (request, responce) => {
	const result = await TaskApi.updateTask(request.query.id, request.body)
	if (result) {
		responce.sendStatus(200)
	} else {
		responce.status(404).send('Task not found')
	}
})

router.delete('/', checkToken, async (request, responce) => {
	const result = await TaskApi.deleteTask(request.query.id)
	if (result) {
		responce.sendStatus(200)
	} else {
		responce.status(404).send('Task not found')
	}
})

module.exports = router