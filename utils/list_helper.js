const dummy = (blogs) => {
  return 1;
};

module.exports = {
  dummy,
};

const totalLikes = (blogs) =>
  blogs.reduce((likesSum, blog) => likesSum + blog.likes, 0);

const favouriteBlog = (blogs) =>
  blogs
    .map((blog) => ({
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    }))
    .reduce((max, blog) => (max.likes > blog.likes ? max : blog));

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
