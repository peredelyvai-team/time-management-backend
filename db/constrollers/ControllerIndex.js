var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
	secret: 'hello world',
	saveUninitialized: false,
	store: new MongoStore({
		url: process.env.DATABASE
	})
}))