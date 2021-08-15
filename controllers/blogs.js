const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
  });
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
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
