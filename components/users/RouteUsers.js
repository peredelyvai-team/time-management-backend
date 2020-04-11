var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const UsersApi = require('./ControllerUser')
const TokensApi = require('../tokens/ControllerToken')
var ObjectID = require('mongodb').ObjectID;

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

var generateAccessToken = (query) => {
	console.log(typeof  process.env.ACCESS_TOKEN_EXPIRES)
	return jwt.sign(query, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' })
}

router.post('/token/refresh', async (request, response) => {
	const refresh_token = request.body.refresh_token
	if (refresh_token === null) {
		return response.sendStatus(401)
	} else {
		const data = await TokensApi.getRefreshTokens()
		const refresh_tokens = data.map(token => token.refresh_token)
		console.log(refresh_token, refresh_tokens)
		if (refresh_tokens.includes(refresh_token)) {
			jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
				console.log(error)
				if (error) {
					return response.status(403).send(error)
				} else {
					console.log(user)
					const access_token = generateAccessToken({ email: user.email })
					const new_refresh_token = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET)
					TokensApi.addToken({refresh_token: new_refresh_token})
					response.send({ access_token, refresh_token: new_refresh_token })
				}
			})
		} else {
			return response.sendStatus(403)
		}
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
	TokensApi.deleteToken(request.body)
	response.sendStatus(200).send('Logout')
})

var checkToken = (request, response, next) => {
	const authHeader = request.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token === null) {
		return response.sendStatus(401)
	} else {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
			if (error) {
				return response.sendStatus(403)
			} else {
				console.log(user)
				request.user = user
				next()
			}
		})
	}
}

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
