const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 3;

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
	response.json(users);
});

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body;

	if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
		return response
			.status(400)
			.json({ error: `password must be at least ${MIN_PASSWORD_LENGTH} characters long` });
	}

	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

	const user = new User({ username, name, passwordHash });

	const savedUser = await user.save();
	response.status(201).json(savedUser);
});

module.exports = usersRouter;
