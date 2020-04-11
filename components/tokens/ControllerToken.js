var crypto = require('crypto')
var Token = require('./ModelToken')

exports.getRefreshTokens = () => {
	return Token.find({})
}

exports.addToken = (token) => {
	return Token.create(token)
}

exports.deleteToken = async (token) => {
	const removing = await Token.deleteOne(token)
	if (removing.deletedCount > 0) {
		console.log(removing)
		return true
	}	else {
		return null
	}
}