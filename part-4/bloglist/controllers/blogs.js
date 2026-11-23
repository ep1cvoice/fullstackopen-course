const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {

	const decodedToken = jwt.verify(request.token, config.SECRET);

	const user = await User.findById(decodedToken.id);
	if (!user) {
		return response.status(401).json({ error: 'not valid token' });
	}

	const blog = new Blog({ ...request.body, user: user._id });

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, config.SECRET);

	const blog = await Blog.findById(request.params.id);
	if (!blog) {
		return response.status(204).end();
	}

	if (blog.user?.toString() !== decodedToken.id) {
		return response.status(403).json({ error: 'only the creator can delete blog' });
	}

	await blog.deleteOne();
	await User.updateOne({ _id: blog.user }, { $pull: { blogs: blog._id } });

	response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
	const { title, author, url, likes } = request.body;

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		{ title, author, url, likes },
		{ returnDocument: 'after', runValidators: true },
	);

	if (!updatedBlog) {
		return response.status(404).end();
	}

	response.json(updatedBlog);
});

module.exports = blogsRouter;
