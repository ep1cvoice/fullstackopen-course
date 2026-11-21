const logger = require('./logger');

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

	logger.error(error.message);
	next(error);
};

module.exports = { errorHandler };
