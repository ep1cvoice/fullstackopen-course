const { test, after, before, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
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

test('a new user can be created and the password is hashed', async () => {
	const newUser = { username: 'Pavlo', name: 'Kovalchuk', password: 'Fullstack' };

	const response = await api
		.post('/api/users')
		.send(newUser)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	assert.strictEqual(response.body.username, newUser.username);
	assert.strictEqual(response.body.name, newUser.name);
	assert.ok(response.body.id);
	assert.strictEqual(response.body.passwordHash, undefined);
	assert.strictEqual(response.body.password, undefined);

	const stored = await User.findOne({ username: newUser.username });
	assert.notStrictEqual(stored.passwordHash, newUser.password);
	assert.ok(await bcrypt.compare(newUser.password, stored.passwordHash));
});

test('all users are returned without password', async () => {
	const response = await api
		.get('/api/users')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	assert.strictEqual(response.body.length, 1);
	assert.strictEqual(response.body[0].username, 'root');
	assert.ok(response.body[0].id);
	assert.strictEqual(response.body[0].passwordHash, undefined);
});

const expectInvalidUser = async (invalidUser, errorPart) => {
	const response = await api
		.post('/api/users')
		.send(invalidUser)
		.expect(400)
		.expect('Content-Type', /application\/json/);

	assert.ok(response.body.error.includes(errorPart));
	assert.strictEqual(await User.countDocuments({}), 1);
};

test('user without username is not created', async () => {
	await expectInvalidUser({ name: 'No Username', password: 'validpass' }, 'username');
});

test('user with too short username is not created', async () => {
	await expectInvalidUser({ username: 'ab', name: 'Short', password: 'validpass' }, 'username');
});

test('user without password is not created', async () => {
	await expectInvalidUser({ username: 'nopass', name: 'No Password' }, 'password');
});

test('user with too short password is not created', async () => {
	await expectInvalidUser({ username: 'shortpass', name: 'Short', password: 'ab' }, 'password');
});

test('user with a non unique username is not created', async () => {
	await expectInvalidUser({ username: 'root', name: 'Duplicate', password: 'validpass' }, 'unique');
});

after(async () => {
	await mongoose.connection.close();
});
