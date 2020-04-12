var crypto = require('crypto')
var User = require('./ModelUser')
var ObjectID = require('mongodb').ObjectID;

exports.createUser = (data) => {
	const user = {
		username: data.username,
		email: data.email,
		password: hash(data.password),
		level: 1,
		stars: 0,
		remainStars: 10
	}
	return User.create(user)
}

exports.getUserProfile = async (id) => {
	const data = await User.findOne(id)
	if (data) {
		return {
			username: data.username,
			level: data.level,
			stars: data.stars,
			levelStars: data.levelStars
		}
	} else {
		return null
	}
}

exports.getUser = (id) => {
	return User.findOne(id)
}

exports.checkUserExists = async (data) => {
	return User.findOne({ email: data.email })
}

exports.checkUsersPassword = async (data) => {
	const user = await User.findOne({ email: data.email })
	if (user) {
		return { user: user, isValid: user.password === hash(data.password) }
	} else {
		return 'error'
	}
}

exports.checkUser = (data) => {
	return User.findOne({ email: data.email })
		.then(
			(doc) => {
				if (doc.password === hash(data.password)) {
					console.log('user pass is ok')
					return Promise.resolve(doc)
				} else {
					return Promise.reject('Error')
				}
			}
		)
}

exports.updateProgress = async (id, task) => {
	let user = await User.findOne({ _id: ObjectID(id)})
	if (user) {
		console.log(task)
		taskStars = (task.important ? 3 : 1) + (task.urgent ? 3 : 1)
		let updatedUser = user
		updatedUser.stars = user.stars + taskStars
		if (updatedUser.stars > updatedUser.levelStars) {
			updatedUser.level++
			updatedUser.levelStars = updatedUser.level * 10
			updatedUser.stars = updatedUser.stars % updatedUser.levelStars
		}
		const result = await User.updateOne({ _id: ObjectID(id)  }, updatedUser)
		return result.nModified
	} else {
		return null
	}
}



function hash(text) {
	return crypto.createHash('sha1')
		.update(text).digest('base64')
}