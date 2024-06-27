import request from "supertest";
import init from "../App";
import mongoose from "mongoose";
import Student from "../models/user_model";
import { App } from "supertest/types";
import User from "../models/auth_user_model";

const testStudent = {
  _id: "John",
  username: "John",
  image: "image",
};

type TestUser = {
  email: string;
  password: string;
  accessToken?: string;
};

const user: TestUser = {
  email: "testStudent@test.com",
  password: "1234",
};

let app: App;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await Student.deleteMany();
  await User.deleteMany({ email: user.email });
  await request(app).post("/auth/register").send(user);
  const res = await request(app).post("/auth/login").send(user);
  user.accessToken = res.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Tests", () => {
  test("Test user get", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", "Bearer " + user.accessToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  //test the post student api
  test("Test user post", async () => {
    const res = await request(app)
      .post("/user")
      .set("Authorization", "Bearer " + user.accessToken)
      .send(testStudent);
    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual(testStudent.username);
    expect(res.body.image).toEqual(testStudent.image);
    expect(res.body._id).toEqual(testStudent._id);
  });

  //test the get student api
  test("Test user get by id", async () => {
    const res = await request(app)
      .get("/user/" + testStudent._id)
      .set("Authorization", "Bearer " + user.accessToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual(testStudent.username);
    expect(res.body.image).toEqual(testStudent.image);
    expect(res.body._id).toEqual(testStudent._id);
  });
});
