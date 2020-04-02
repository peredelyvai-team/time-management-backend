var crypto = require('crypto')
var Token = require('../models/ModelToken')

exports.getRefreshTokens = () => {
	return Token.find({})
}

exports.addToken = (token) => {
	return Token.create(token)
}

exports.deleteToken = (token) => {
	return Token.deleteOne(token)
}