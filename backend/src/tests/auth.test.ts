import request from "supertest";
import init from "../App";
import mongoose from "mongoose";
import { App } from "supertest/types";
import User from "../models/auth_user_model";

jest.setTimeout(20000);
interface Cred {
  credential: string;
}
interface Profile {
  email: string,
  username:string,
  image: string
}
const profile:Profile={
  email:"test@test.com",
  username:"updatedUser",
  image:"image"
}
const password="123123"
type TestUser = {
  image:string
  username: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?:string;
};
const credential: Cred = {
  credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyZTExOTg2MjgyZGU5M2YyN2IyNjRmZDJhNGRlMTkyOTkzZGNiOGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NDY3NDU5OTg5MDAtcXF0c2cxcnFhZjI5MDV2Zmo1bTZzNHE3dDB2YTg4NHYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NDY3NDU5OTg5MDAtcXF0c2cxcnFhZjI5MDV2Zmo1bTZzNHE3dDB2YTg4NHYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTY4MDUwNTMzOTIxNzM4NDkyMDMiLCJlbWFpbCI6Inppdi5zaWFnQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MjE5MDU2NDAsIm5hbWUiOiJaaXYgU2lhZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKaW80WklXdEpQdFpKbWg3RXd6NUx0LXRpYzhFY1ZiNkVnY2ZkRERTX0drSGM0NVE9czk2LWMiLCJnaXZlbl9uYW1lIjoiWml2IiwiZmFtaWx5X25hbWUiOiJTaWFnIiwiaWF0IjoxNzIxOTA1OTQwLCJleHAiOjE3MjE5MDk1NDAsImp0aSI6ImU5MGE2YjJlM2ViZWM1YmM5M2NjODg1MjYzZTYzZGIyYjlkZmYxOTQifQ.a1mto24Gg1Vz9Z7fKvlsWwK_1CtK19_cN-31zcvPKhK0atQQZ_Y5Qo-FqIUorVE8nlAG68eBCUF9aL9zJvDDwOh69uav_3mo0vxtksQoa05RFWtfNmgWD5Zl-CCQiOPfVjkiP4gdiUV8jBpPRKwPjo_tfNrf55v7zbNySWI90umA2XDuKRumg17P01qyqA3nVHDatXBb8Z7ULVXZAiXWRKJ0rLFSqW2JhjfRmtk7UuAbXMUYPqhQv1Xj848ol1srCGL1rTNrAlxb-3gMqT3YhUdJXijcDzFvI8Gd-cs-Od_7X7k75eiOZnCgiMPjH9KwBlvLbmpIoJHAb8IEFxbJzQ"
};
const user: TestUser = {
  email: "test@test.com",
  password: "1234",
  username: "XXXX",
  image:"backend/public/1720888565979.jpg"
};

let app: App;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Tests", () => {
  test("Register", async () => {
    const res = await request(app).post("/auth/register").send(user);
    expect(res.statusCode).toEqual(200);
  });

  test("Login", async () => {
    const res = await request(app).post("/auth/login").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
    user._id = res.body._id;
  });

  test("Middleware", async () => {
    const res2 = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);

    const res3=await request(app)
      .post("/post")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        type: "gaming",
        gpu: "ryzen5000",
        cpu: "i7",
        motherboard:"asus",
        memory:"hdd1024gb",
        ram:"16gb",
        image:"image",
        comments:0
      });
      expect(res3.statusCode).toEqual(201);
      expect(res3.body.type).toEqual("gaming");
      expect(res3.body.gpu).toEqual("ryzen5000");
      expect(res3.body.cpu).toEqual("i7");
      expect(res3.body.motherboard).toEqual("asus");
      expect(res3.body.memory).toEqual( "hdd1024gb");
      expect(res3.body.ram).toEqual("16gb");
      expect(res3.body.image).toEqual("image");
      expect(res3.body.comments).toEqual(0);

  });

  test("Refresh Token", async () => {
    await new Promise((r) => setTimeout(r, 11000));
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).not.toEqual(200);
   

    const res2 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty("accessToken");
    expect(res2.body).toHaveProperty("refreshToken");
    user.accessToken = res2.body.accessToken;
    user.refreshToken = res2.body.refreshToken;

    const res3 = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res3.statusCode).toEqual(200);
  });

  test("Refresh Token hacked", async () => {
    const res = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res.statusCode).toEqual(200);
    const newRefreshToken = res.body.refreshToken;
    const res2 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res2.statusCode).not.toEqual(200);
    const res3 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + newRefreshToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
  });

  test("Logout", async () => {
    const res = await request(app).post("/auth/login").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;

    const res2 = await request(app)
      .get("/auth/logout")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res2.statusCode).toEqual(200);

    const res3 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
  });

  test("Google-Signin", async () => {
  
    const res4 = await request(app)
    .post("/auth/googleSignin")
    .send(credential);
    expect(res4.statusCode).toEqual(200);
    expect(res4.body).toHaveProperty("accessToken");
    expect(res4.body).toHaveProperty("refreshToken");
  });

  test("Get Profile",async ()=>{
    const res4 = await request(app)
    .get("/auth/info")
    .set("Authorization", "Bearer " + user.accessToken)
    .send();
    expect(res4.statusCode).toEqual(200)
    expect(res4.body.username).toEqual(user.username)
    expect(res4.body.email).toEqual(user.email)
    expect(res4.body.image).toEqual(user.image)
  })

  test("Update", async()=>{
    const res5= await request(app)
    .put("/auth/update")
    .set("Authorization", "Bearer " + user.accessToken)
    .send({profile: profile,password: password})
    expect(res5.statusCode).toEqual(200)
    expect(res5.body.username).toEqual(profile.username)
    expect(res5.body.email).toEqual(profile.email)
    expect(res5.body.image).toEqual(profile.image)
  })
});
