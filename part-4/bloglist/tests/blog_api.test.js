const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

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
	await User.deleteMany({});

	const passwordHash = await bcrypt.hash('sekret', 10);
	const user = await new User({ username: 'root', name: 'Superuser', passwordHash }).save();

	const blogs = await Blog.insertMany(initialBlogs.map((blog) => ({ ...blog, user: user._id })));
	user.blogs = blogs.map((blog) => blog._id);
	await user.save();
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

test('a blog can be deleted', async () => {
	const blogsAtStart = await api.get('/api/blogs');
	const blogToDelete = blogsAtStart.body[0];

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const blogsAtEnd = await api.get('/api/blogs');
	assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1);

	const titles = blogsAtEnd.body.map((b) => b.title);
	assert.ok(!titles.includes(blogToDelete.title));
});

test('deleting with a bad id return 400', async () => {
	await api.delete('/api/blogs/not-a-valid-id').expect(400);

	const response = await api.get('/api/blogs');
	assert.strictEqual(response.body.length, initialBlogs.length);
});

test('likes of a blog can be updated', async () => {
	const blogsAtStart = await api.get('/api/blogs');
	const blogToUpdate = blogsAtStart.body[0];

	const response = await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
		.expect(200)
		.expect('Content-Type', /application\/json/);

	assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

	const blogsAtEnd = await api.get('/api/blogs');
	const updated = blogsAtEnd.body.find((b) => b.id === blogToUpdate.id);

	assert.strictEqual(updated.likes, blogToUpdate.likes + 1);
	assert.strictEqual(updated.title, blogToUpdate.title);
	assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length);
});

test('updating a non-existing blog returns 404', async () => {
	const nonExistingId = new mongoose.Types.ObjectId().toString();

	await api.put(`/api/blogs/${nonExistingId}`).send({ likes: 1 }).expect(404);
});

test('listed blogs include creator info without password data', async () => {
	const response = await api.get('/api/blogs');

	response.body.forEach((blog) => {
		assert.strictEqual(blog.user.username, 'root');
		assert.strictEqual(blog.user.name, 'Superuser');
		assert.ok(blog.user.id);
		assert.strictEqual(blog.user.passwordHash, undefined);
	});
});

test('a new blog is assigned to a user and appears in that user\'s blogs', async () => {
	const newBlog = {
		title: 'Blog linked to a user',
		author: 'Nobody',
		url: 'http://example.com/linked',
	};

	const response = await api.post('/api/blogs').send(newBlog).expect(201);

	const user = await User.findOne({ username: 'root' });
	assert.strictEqual(response.body.user, user.id);
	assert.strictEqual(user.blogs.length, initialBlogs.length + 1);
	assert.ok(user.blogs.some((id) => id.toString() === response.body.id));
});

test('adding a blog fails with 400 when no users exist', async () => {
	await User.deleteMany({});

	await api
		.post('/api/blogs')
		.send({ title: 'Orphan', url: 'http://example.com/orphan' })
		.expect(400);

	assert.strictEqual(await Blog.countDocuments({}), initialBlogs.length);
});

after(async () => {
	await mongoose.connection.close();
});
