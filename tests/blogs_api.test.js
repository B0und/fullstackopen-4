const supertest = require("supertest");

const mongoose = require("mongoose");

const helper = require("./test_helper");

const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");

let JWT_TOKEN;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await Blog.insertMany(helper.authBlogs);

  const passwordHash = await bcrypt.hash("root", 10);
  const user = new User({
    username: "root",
    name: "matt",
    passwordHash,
  });
  await user.save();

  const response = await api.post("/api/login/").send({
    username: "root",
    password: "root",
  });

  JWT_TOKEN = response.body.token;
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("initial blogs are present", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.authBlogs.length);
});

test("property id exists", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

describe("Auth API tests", () => {
  test("a valid blog can be added ", async () => {

    const newBlog = {
      title: "somerandomtext idk",
      author: "anon",
      url: "localhost",
      likes: 0,
    };

    await api
      .post("/api/blogs/")
      .set({ Authorization: `bearer ${JWT_TOKEN}` })
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // test that blogs amount increased
    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).toHaveLength(helper.authBlogs.length + 1);

    // test that the last added blog title is correct
    const titles = blogsInDb.map((b) => b.title);
    expect(titles).toContain("somerandomtext idk");

    // test if the initial number of likes is 0
    expect(blogsInDb[blogsInDb.length - 1].likes).toBe(0);
  }, 10000);

  test("blog with wrong token is not added", async () => {
    const newBlog = {
      title: "somerandomtext idk",
      author: "anon",
      url: "localhost",
      likes: 0,
    };

    await api
      .post("/api/blogs/")
      .set({ Authorization: `bearer FakeId` })
      .send(newBlog)
      .expect(401);

    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).toHaveLength(helper.authBlogs.length);
  });


  test("blog without content is not added", async () => {
    const newBlog = {
      url: "333333333333",
    };

    await api
      .post("/api/blogs/")
      .set({ Authorization: `bearer ${JWT_TOKEN}` })
      .send(newBlog)
      .expect(400);

    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).toHaveLength(helper.authBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
