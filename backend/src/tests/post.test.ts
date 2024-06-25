import request from "supertest";
import init from "../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/user_model";

type TestUser = {
  email: string,
  password: string,
  accessToken?: string
}

const user: TestUser = {
  "email": "testStudent@test.com",
  "password": "1234"
}

const testPost1 = {
    title: "John",
    message: "Lohn",
    owner: "Gohn",
  };






let app;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await Post.deleteMany();
  await User.deleteMany({ "email": user.email });
  await request(app).post("/auth/register").send(user);
  const res = await request(app).post("/auth/login").send(user);
  user.accessToken = res.body.accessToken;
});


afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Posts Tests", () => {
    test("Test post get", async () => {
      const res = await request(app).get("/post")
      .set("Authorization", "Bearer " + user.accessToken);
      expect(res.statusCode).toEqual(200);
    });
});

//test post post api
test("Test post post", async () => {
    const res = await request(app).post("/post").send(testPost1)
    .set("Authorization", "Bearer " + user.accessToken);
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual(testPost1.title);
    expect(res.body.message).toEqual(testPost1.message);
    
  });

