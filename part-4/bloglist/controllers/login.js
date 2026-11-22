const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const config = require('../utils/config');
const User = require('../models/user');

const TOKEN_TTL_SECONDS = 60 * 60;

loginRouter.post('/', async (request, response) => {
	const { username, password } = request.body;

	if (typeof username !== 'string' || typeof password !== 'string') {
		return response.status(400).json({ error: 'username and password must be given as strings' });
	}

	const user = await User.findOne({ username });
	const passwordCorrect = user !== null && (await bcrypt.compare(password, user.passwordHash));

	if (!passwordCorrect) {
		return response.status(401).json({ error: 'invalid username or password' });
	}

	const token = jwt.sign({ username: user.username, id: user._id }, config.SECRET, {
		expiresIn: TOKEN_TTL_SECONDS,
	});

	response.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
