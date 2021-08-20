const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const helper = require("../tests/test_helper");
const logger = require("../utils/logger");

const extractIdFromToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  return decodedToken.id;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedId = extractIdFromToken(body.token);
  const user = await User.findById(decodedId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: user,
  });

  // add user info to blog obj
  // blog.user = user;
  const savedBlog = await blog.save();

  // assign new blog to user
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();

  response.json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedId = extractIdFromToken(request.body.token);
  const user = await User.findById(decodedId);

  const blog = await Blog.findById(request.params.id);
  console.log("INFO:");
  console.log(`${blog.user.toString()} ${typeof(blog.user.toString())}`);
  console.log(`${user.id} ${typeof(user.id)}`);

  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }
  else {
    response.status(401).end();
  }

});

blogsRouter.put("/:id", async (request, response) => {
  await Blog.findByIdAndUpdate(
    { _id: request.params.id },
    { likes: request.body.likes },
    { runValidators: true, context: "query" }
  );
  response.status(204).end();
});

module.exports = blogsRouter;
