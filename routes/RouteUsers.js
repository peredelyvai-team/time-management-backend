var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const UsersApi = require('../db/constrollers/ControllerUser')

/* GET users listing. */

router.post('/registration', async (request, response, next) => {
	const isExists = await UsersApi.checkUserExists(request.body)
	if (!isExists) {
		const result = await UsersApi.createUser(request.body)
		response.send(result)
	} else {
		response.status(400).send('User with granted email is already exists')
	}
})

router.post('/login', async (request, response, next) => {
	if (request.session.user) {
		return response.redirect('/')
	} else {
		const data = await UsersApi.checkUsersPassword(request.body)
		if (typeof data === 'object') {
			if (data.isValid) {
				request.session.user = { id: data.user._id, name: data.user.name }
				const access_token = jwt.sign({ user: data.user.username, email: data.user.email }, process.env.ACCESS_TOKEN_SECRET)
				response.send({ access_token: access_token })
			} else {
				response.status(400).send('Invalid authorization data')
			}
		} else {
			response.status(400).send('User does not exists')
		}
	}
})

router.post('/logout', (request, response, next) => {
	if (request.session.user) {
		delete request.session.user;
	}
	response.send('logout')
})

router.get('/', async (request, response, next) => {
})

router.post('/registration', async (request, response, next) => {
	console.log('create')
	const result = await UsersApi.createUser(request.body)
	response.send(result)
	// if (error.toJSON().code === 11000) {
	// 	response.status(500).send('This email already exists')
	// }
})

module.exports = router;
