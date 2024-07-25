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
let initialPost
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
  initialPost = await request(app).post("/post").set("Authorization", "Bearer " + user.accessToken).send(testPost1);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts Tests", () => {


//test post post api
test("Post", async () => {
  const res1 = await request(app)
    .post("/post")
    .set("Authorization", "Bearer " + user.accessToken)
    .send(testPost1);
  expect(res1.statusCode).toEqual(201);
  expect(res1.body).toHaveProperty("_id");
  expect(res1.body.type).toEqual(initialPost.body.type);
  expect(res1.body.gpu).toEqual(initialPost.body.gpu);
  expect(res1.body.cpu).toEqual(initialPost.body.cpu);
  expect(res1.body.motherboard).toEqual(initialPost.body.motherboard);
  expect(res1.body.memory).toEqual(initialPost.body.memory);
  expect(res1.body.ram).toEqual(initialPost.body.ram);
  expect(res1.body.image).toEqual(initialPost.body.image);
  expect(res1.body.comments).toEqual(0);
});
test("Get", async () => {
  const res2 = await request(app)
    .get("/post/"+initialPost.body._id)
    .set("Authorization", "Bearer " + user.accessToken)
    .send()
  expect(res2.statusCode).toEqual(200);
  expect(res2.body).toHaveProperty("_id");
  expect(res2.body.type).toEqual(initialPost.body.type);
  expect(res2.body.gpu).toEqual(initialPost.body.gpu);
  expect(res2.body.cpu).toEqual(initialPost.body.cpu);
  expect(res2.body.motherboard).toEqual(initialPost.body.motherboard);
  expect(res2.body.memory).toEqual(initialPost.body.memory);
  expect(res2.body.ram).toEqual(initialPost.body.ram);
  expect(res2.body.image).toEqual(initialPost.body.image);
  expect(res2.body.comments).toEqual(0);
});

test("Get My Posts",async()=>{
  const res3= await request(app)
    .get("/post/getMyPosts")
    .set("Authorization", "Bearer " + user.accessToken)
    .send()
    expect(res3.statusCode).toEqual(200);
    expect(res3.body[0].type).toEqual(initialPost.body.type);
    expect(res3.body[0].gpu).toEqual(initialPost.body.gpu);
    expect(res3.body[0].cpu).toEqual(initialPost.body.cpu);
    expect(res3.body[0].motherboard).toEqual(initialPost.body.motherboard);
    expect(res3.body[0].memory).toEqual(initialPost.body.memory);
    expect(res3.body[0].ram).toEqual(initialPost.body.ram);
    expect(res3.body[0].image).toEqual(initialPost.body.image);
    expect(res3.body[0].comments).toEqual(0);
})

test("Update Post",async()=>{
  initialPost.body.type="office"
  const res4= await request(app)
  .put("/post")
  .set("Authorization", "Bearer " + user.accessToken)
  .send(initialPost.body)
  expect(res4.statusCode).toEqual(200);
  expect(res4.body.type).toEqual("office");
  expect(res4.body.gpu).toEqual(initialPost.body.gpu);
  expect(res4.body.cpu).toEqual(initialPost.body.cpu);
  expect(res4.body.motherboard).toEqual(initialPost.body.motherboard);
  expect(res4.body.memory).toEqual(initialPost.body.memory);
  expect(res4.body.ram).toEqual(initialPost.body.ram);
  expect(res4.body.image).toEqual(initialPost.body.image);
  expect(res4.body.comments).toEqual(0);
})

test("Delete Post",async()=>{
  const res5= await request(app)
  .delete("/post")
  .set("Authorization", "Bearer " + user.accessToken)
  .send({id:initialPost.body._id})
  expect(res5.statusCode).toEqual(200)
  await res5
  const res6 = await request(app)
  .get("/post/"+initialPost.body._id)
  .set("Authorization", "Bearer " + user.accessToken)
  .send()
  expect(res6.statusCode).toEqual(200)
  expect(res6.body).toEqual({})
})

});