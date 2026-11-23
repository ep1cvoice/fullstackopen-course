const logger = require('./logger');

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization');

	request.token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
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

module.exports = { tokenExtractor, errorHandler };
