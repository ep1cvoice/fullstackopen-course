const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
		likes: 5,
	},
	{
		title: 'Structure and Interpretation of Computer Programs',
		author: 'Abelson, Sussman & Sussman',
		url: 'https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html',
		likes: 10,
	},
];

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');

	assert.strictEqual(response.body.length, initialBlogs.length);
});

test('a test that verifies that the unique identifier property of the blog posts is named id, by default the database names the property _id', async () => {
	const response = await api.get('/api/blogs');
	const blogs = response.body;

	blogs.forEach((blog) => {
		assert.ok(blog.id);
		assert.strictEqual(blog._id, undefined);
	});
});

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');

	assert.strictEqual(response.body.length, initialBlogs.length + 1);

	const saved = response.body.find((b) => b.title === newBlog.title);
	assert.ok(saved);
	assert.strictEqual(saved.author, newBlog.author);
	assert.strictEqual(saved.url, newBlog.url);
	assert.strictEqual(saved.likes, newBlog.likes);
});

test('likes go to 0 when missing from request', async () => {
	const newBlog = {
		title: 'Blog without likes',
		author: 'Nobody',
		url: 'http://example.com/no-likes',
	};

	await api.post('/api/blogs').send(newBlog).expect(201);

	const response = await api.get('/api/blogs');
	const saved = response.body.find((b) => b.title === newBlog.title);

	assert.strictEqual(saved.likes, 0);
});

test('blog without title is not added and return 400', async () => {
	const newBlog = { author: 'Nobody', url: 'http://example.com/no-title', likes: 1 };

	await api.post('/api/blogs').send(newBlog).expect(400);

	const response = await api.get('/api/blogs');
	assert.strictEqual(response.body.length, initialBlogs.length);
});

test('blog without url is not added and return 400', async () => {
	const newBlog = { title: 'Blog without url', author: 'Nobody', likes: 1 };

	await api.post('/api/blogs').send(newBlog).expect(400);

	const response = await api.get('/api/blogs');
	assert.strictEqual(response.body.length, initialBlogs.length);
});

after(async () => {
	await mongoose.connection.close();
});
