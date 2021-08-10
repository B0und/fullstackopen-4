var fp = require("lodash/fp");

const dummy = (blogs) => {
  return 1;
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

const mostBlogs = fp.flow(
  fp.countBy("author"), // count by name
  fp.toPairs, // convert to [key, value] pairs
  fp.maxBy(fp.tail), // find the max by the value (tail)
  fp.values // get the key (head)
);

const mostLikes = (blogs) => {
  const authorsAndSummedLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const vals = Object.values(authorsAndSummedLikes);
  const max = Math.max(...vals);

  Object.filter = (obj, predicate) =>
    Object.fromEntries(Object.entries(obj).filter(predicate));

  return Object.filter(authorsAndSummedLikes, ([name, likes]) => likes === max);
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
