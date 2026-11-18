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
