const dummy = (blogs) => {
  return 1;
};

module.exports = {
  dummy,
};

const totalLikes = (blogs) =>
  blogs.reduce((likesSum, blog) => likesSum + blog.likes, 0);

module.exports = {
  dummy, totalLikes
};
