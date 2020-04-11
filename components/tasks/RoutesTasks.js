var express = require('express');
var router = express.Router();
var TaskApi = require('./ControllerTask')
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

module.exports = router