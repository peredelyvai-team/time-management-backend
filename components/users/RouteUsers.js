var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const UsersApi = require('./ControllerUser')
const TokensApi = require('../tokens/ControllerToken')
var ObjectID = require('mongodb').ObjectID;
var { generateAccessToken, checkToken } = require('../../helpers/token')

router.post('/registration', async (request, response, next) => {
	const isExists = await UsersApi.checkUserExists(request.body)
	if (!isExists) {
		const result = await UsersApi.createUser(request.body)
		const query = {
			username: result.username,
			email: result.email
		}
		response.send(query)
	} else {
		response.status(400).send('User with granted email is already exists')
	}
})


router.post('/login', async (request, response) => {
	const data = await UsersApi.checkUsersPassword(request.body)
	if (typeof data === 'object') {
		if (data.isValid) {
			request.session.user = { id: data.user._id, name: data.user.name }
			const access_token = generateAccessToken({email: request.body.email})
			const refresh_token = jwt.sign({ email: request.body.email }, process.env.REFRESH_TOKEN_SECRET)
			await TokensApi.addToken({refresh_token})
			response.send({ access_token, refresh_token, uid: data.user._id })
		} else {
			response.status(400).send('Invalid authorization data')
		}
	} else {
		response.status(404).send('User does not exists')
	}
})


router.post('/logout', async (request, response) => {
	const success = await TokensApi.deleteToken(request.body)
	if (success) {
		response.status(200).send('Logout')
	}	else {
		response.sendStatus(403)
	}
})



router.get('/profile', checkToken, async (request, response) => {
	try {
		const id = new ObjectID(request.query.id)
		const user = await UsersApi.getUserProfile({_id: id})
		response.json(user)
	} catch {
		response.status(403).send('User not found')
	}
})

router.get('/', checkToken, (request, response, next) => {
	response.send('hello men')
})

module.exports = router;
