const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  // add user
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({
    username: "611d455d84e90383f6bb6872",
    name: "matt",
    passwordHash,
  });
  await user.save();

  const users = await helper.usersInDb();
  const userId = users[0].id;

  // add blogs
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    blogObject.userId = userId;
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("initial blogs are present", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("property id exists", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added ", async () => {
  const users = await helper.usersInDb();
  const userId = users[0].id;

  const newBlog = {
    title: "my new coding routine",
    author: "anon",
    url: "localhost",
    userId: userId,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // test that blogs amount increased
  const blogsInDb = await helper.blogsInDb();
  expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1);

  // test that the last added blog title is correct
  const titles = blogsInDb.map((b) => b.title);
  expect(titles).toContain("my new coding routine");

  // test if the initial number of likes is 0
  expect(blogsInDb[blogsInDb.length - 1].likes).toBe(0);
});

test("blog without content is not added", async () => {
  const newBlog = {
    url: "ababab",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsInDb = await helper.blogsInDb();
  expect(blogsInDb).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
