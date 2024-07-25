import request from "supertest";
import init from "../App";
import mongoose from "mongoose";
import PostComment from "../models/post_comment_model";
import Post from "../models/post_model";
import User from "../models/auth_user_model";

jest.setTimeout(20000);
type TestUser = {
  email: string;
  password: string;
  image: string;
  username: string;
  _id?: string;
  accessToken?: string;
};

const user: TestUser = {
  email: "testComment@test.com",
  image: "image",
  username: "CommentUser",
  password: "1234",
};

const testPost = {
  owner: "someOwnerId",
  type: "gaming",
  gpu: "ryzen5000",
  cpu: "i7",
  motherboard: "asus",
  memory: "hdd1024gb",
  ram: "16gb",
  image: "image",
  comments: 0,
};

const testComment = {
  postId: "",
  userId: "",
  userName: user.username,
  content: "This is a comment",
};

let app;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await Post.deleteMany();
  await PostComment.deleteMany();
  await User.deleteMany({ email: user.email });

  // Register and login the user
  const res1 = await request(app).post("/auth/register").send(user);
  user._id = res1.body._id;
  testComment.userId = user._id;
  const res2 = await request(app).post("/auth/login").send(user);
  user.accessToken = res2.body.accessToken;

  // Create a post to comment on
  const postResponse = await request(app)
    .post("/post")
    .set("Authorization", "Bearer " + user.accessToken)
    .send(testPost);
  testComment.postId = postResponse.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post Comments Tests", () => {
  test("Test post comment", async () => {
    const res = await request(app)
      .post("/post/comments")
      .set("Authorization", "Bearer " + user.accessToken)
      .send(testComment);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.postId).toEqual(testComment.postId);
    expect(res.body.userId).toEqual(testComment.userId);
    expect(res.body.userName).toEqual(testComment.userName);
    expect(res.body.content).toEqual(testComment.content);
  });

  test("Test get all comments", async () => {
    const res = await request(app)
      .get(`/post/comments/${testComment.postId}`)
      .set("Authorization", "Bearer " + user.accessToken);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
