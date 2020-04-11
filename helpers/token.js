const jwt = require('jsonwebtoken')

exports.generateAccessToken = (query) => {
	console.log(typeof  process.env.ACCESS_TOKEN_EXPIRES)
	return jwt.sign(query, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' })
}


exports.checkToken = (request, response, next) => {
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