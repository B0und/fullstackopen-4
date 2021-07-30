var _ = require("lodash");
var fp = require("lodash/fp");

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


const mostBlogs = fp.flow(
    fp.countBy("author"), // count by name
    fp.toPairs, // convert to [key, value] pairs
    fp.maxBy(fp.tail), // find the max by the value (tail)
    fp.values// get the key (head)
  );

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
};
