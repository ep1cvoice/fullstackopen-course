const { test, after, before, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const config = require('../utils/config');
const User = require('../models/user');

const api = supertest(app);

before(async () => {
	await User.init();
});

beforeEach(async () => {
	await User.deleteMany({});

	const passwordHash = await bcrypt.hash('sekret', 10);
	await new User({ username: 'root', name: 'Superuser', passwordHash }).save();
});

test('login success with correct credentials and returns valid token', async () => {
	const response = await api
		.post('/api/login')
		.send({ username: 'root', password: 'sekret' })
		.expect(200)
		.expect('Content-Type', /application\/json/);

	assert.strictEqual(response.body.username, 'root');
	assert.strictEqual(response.body.name, 'Superuser');

	const decoded = jwt.verify(response.body.token, config.SECRET);
	const user = await User.findOne({ username: 'root' });
	assert.strictEqual(decoded.id, user.id);
	assert.strictEqual(decoded.username, 'root');
	assert.ok(decoded.exp, 'token should expire');
});

test('login fails with 401 for wrong password', async () => {
	const response = await api
		.post('/api/login')
		.send({ username: 'root', password: 'wrong' })
		.expect(401);

	assert.strictEqual(response.body.error, 'invalid username or password');
	assert.strictEqual(response.body.token, undefined);
});

test('login fails with 401 for an unknown username', async () => {
	const response = await api
		.post('/api/login')
		.send({ username: 'nobody', password: 'sekret' })
		.expect(401);

	assert.strictEqual(response.body.error, 'invalid username or password');
});

test('login fails with 400 when username or password is missing or not a str', async () => {
	await api.post('/api/login').send({ username: 'root' }).expect(400);
	await api.post('/api/login').send({ password: 'sekret' }).expect(400);
	await api.post('/api/login').send({ username: { $ne: null }, password: 'sekret' }).expect(400);
});

after(async () => {
	await mongoose.connection.close();
});
