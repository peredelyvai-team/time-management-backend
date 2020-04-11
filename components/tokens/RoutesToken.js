var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const TokensApi = require('../tokens/ControllerToken')
var { generateAccessToken } = require('../../helpers/token')

router.post('/token/refresh', async (request, response) => {
	const refresh_token = request.body.refresh_token
	if (refresh_token === null) {
		return response.sendStatus(401)
	} else {
		const data = await TokensApi.getRefreshTokens()
		const refresh_tokens = data.map(token => token.refresh_token)
		if (refresh_tokens.includes(refresh_token)) {
			jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
				if (error) {
					return response.status(403).send(error)
				} else {
					const access_token = generateAccessToken({ email: user.email })
					const new_refresh_token = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET)
					TokensApi.addToken({refresh_token: new_refresh_token})
					TokensApi.deleteToken({ refresh_token })
					response.send({ access_token, refresh_token: new_refresh_token })
				}
			})
		} else {
			return response.sendStatus(403)
		}
	}
})

module.exports = router;