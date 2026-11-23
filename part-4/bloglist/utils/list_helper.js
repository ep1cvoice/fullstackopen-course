// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1;
};


const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
	return blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best), { likes: -1 });
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return null;
	}

	const counts = new Map();
	blogs.forEach((blog) => {
		counts.set(blog.author, (counts.get(blog.author) ?? 0) + 1);
	});

	const [author, count] = [...counts.entries()].reduce((best, current) =>
		current[1] > best[1] ? current : best,
	);

	return { author, blogs: count };
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
};