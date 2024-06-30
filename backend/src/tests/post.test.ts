import request from "supertest";
import init from "../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/auth_user_model";

jest.setTimeout(20000);
type TestUser = {
  email: string;
  password: string;
  image:string;
  username: string;
  _id?: string;
  accessToken?: string;
};

const user: TestUser = {
  email: "testPost@test.com",
  image:"image",
  username: "XXXXXXXXXXX",
  password: "1234",
};

const testPost1 = {
  owner: user.username,
  type: "gaming",
  gpu: "ryzen5000",
  cpu: "i7",
  motherboard:"asus",
  memory:"hdd1024gb",
  ram:"16gb",
  image:"image",
  comments:0
};

let app;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await Post.deleteMany();
  await User.deleteMany({ email: user.email });
  const res1=await request(app).post("/auth/register").send(user);
  user._id = res1.body._id;
  testPost1.owner=user._id;
  const res2 = await request(app).post("/auth/login").send(user);
  user.accessToken = res2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts Tests", () => {
  test("Test post get", async () => {
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + user.accessToken);
    expect(res.statusCode).toEqual(200);
  });
});

//test post post api
test("Test post post", async () => {
  const res = await request(app)
    .post("/post")
    .send(testPost1)
    .set("Authorization", "Bearer " + user.accessToken);
  expect(res.statusCode).toEqual(201);
  expect(res.body).toHaveProperty("_id");
  expect(user._id).toEqual(testPost1.owner);
  expect(res.body.type).toEqual(testPost1.type);
  expect(res.body.gpu).toEqual(testPost1.gpu);
  expect(res.body.cpu).toEqual(testPost1.cpu);
  expect(res.body.motherboard).toEqual(testPost1.motherboard);
  expect(res.body.memory).toEqual(testPost1.memory);
  expect(res.body.ram).toEqual(testPost1.ram);
  expect(res.body.image).toEqual(testPost1.image);
  expect(res.body.comments).toEqual(0);
 
  
});
