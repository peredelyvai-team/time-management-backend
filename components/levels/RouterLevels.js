var express = require('express')
var router = express.Router()
var fs = require("fs")
var path = require('path')
var { checkToken } = require('../../helpers/token')

router.get('/', async (request, response) => {
	const fileName = request.query.level + 'level.glb'
	response.json({ file: path.join(__dirname, '../../public/models', fileName) })
})

module.exports = router
