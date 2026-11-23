const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	assert.strictEqual(result, 1);
});

describe('total likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0,
		},
	];

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		assert.strictEqual(result, 5);
	});

	test('when list is empty, equals zero', () => {
		const result = listHelper.totalLikes([]);
		assert.strictEqual(result, 0);
	});

	test('when list has multiple blogs, equals the sum of their likes', () => {
		const listWithMultipleBlogs = [
			{
				_id: '5a422aa71b54a676234d17f8',
				title: 'Go To Statement Considered Harmful',
				author: 'Edsger W. Dijkstra',
				url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
				likes: 5,
				__v: 0,
			},
			{
				_id: '5a422aa71b54a676234d17f9',
				title: 'Structure and Interpretation of Computer Programs',
				author: 'Abelson, Sussman & Sussman',
				url: 'https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html',
				likes: 10,
				__v: 0,
			},
		];
		const result = listHelper.totalLikes(listWithMultipleBlogs);
		assert.strictEqual(result, 15);
	});
});

describe('favorite blog', () => {
	test('returns the blog with the most likes', () => {
		const blogs = [
			{
				_id: '5a422aa71b54a676234d17f8',
				title: 'Go To Statement Considered Harmful',
				author: 'Edsger W. Dijkstra',
				url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
				likes: 5,
				__v: 0,
			},
			{
				_id: '5a422aa71b54a676234d17f9',
				title: 'Structure and Interpretation of Computer Programs',
				author: 'Abelson, Sussman & Sussman',
				url: 'https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html',
				likes: 10,
				__v: 0,
			},
		];

		const result = listHelper.favoriteBlog(blogs);

		assert.deepStrictEqual(result, {
			_id: '5a422aa71b54a676234d17f9',
			title: 'Structure and Interpretation of Computer Programs',
			author: 'Abelson, Sussman & Sussman',
			url: 'https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html',
			likes: 10,
			__v: 0,
		});
	});
});

describe('most blogs', () => {
	const blogs = [
		{ title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 },
		{ title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 },
		{ title: 'First class tests', author: 'Robert C. Martin', likes: 10 },
		{ title: 'TDD harms architecture', author: 'Robert C. Martin', likes: 0 },
		{ title: 'Clean Code', author: 'Robert C. Martin', likes: 2 },
		{ title: 'React patterns', author: 'Michael Chan', likes: 7 },
	];

	test('returns the author with the most blogs and the blog count', () => {
		assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: 'Robert C. Martin', blogs: 3 });
	});

	test('when list has only one blog, returns author with count 1', () => {
		assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), { author: 'Edsger W. Dijkstra', blogs: 1 });
	});

	test('when list is empty, return null', () => {
		assert.strictEqual(listHelper.mostBlogs([]), null);
	});
});
