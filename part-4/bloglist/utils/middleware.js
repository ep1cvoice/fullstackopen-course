const jwt = require('jsonwebtoken');
const logger = require('./logger');
const config = require('./config');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization');

	request.token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
	next();
};

const userExtractor = async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, config.SECRET);

	const user = await User.findById(decodedToken.id);
	if (!user) {
		return response.status(401).json({ error: 'not valid token' });
	}

	request.user = user;
	next();
};

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).json({ error: 'bad id' });
	}

	if (error.name === 'MongoServerError' && error.code === 11000) {
		return response.status(400).json({ error: 'expected unique username' });
	}

	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	if (error.name === 'TokenExpiredError') {
		return response.status(401).json({ error: 'token expired' });
	}

	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid or token missing' });
	}

	logger.error(error.message);
	next(error);
};

module.exports = { tokenExtractor, userExtractor, errorHandler };
