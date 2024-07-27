import { Request, Response, NextFunction } from "express";
import User, { IAuthUser } from "../models/auth_user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { OAuth2Client } from "google-auth-library";


const put = async (req: AuthRequest, res: Response)=> {
  const myObject = req.body;
  try {
      const updatedMyObject = await User.findByIdAndUpdate(
          myObject._id,
          myObject,
          { new: true }
      );
      await updatedMyObject.save();
      res.status(200).json(updatedMyObject);
  } catch (err) {
      res.status(500).send(err.message);
  }
};

const updateProfile=async (req: AuthRequest, res: Response) => {
  const user:IAuthUser = await User.findOne({_id:req.user._id});
  const username = req.body.profile.username;
  const email = user.email;
  const image = req.body.profile.image;
  let password;
  if(req.body.password==""){
    password=user.password;
  }
  else{
    password=req.body.password;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
  }
  try {
    const newProfile = await User.findByIdAndUpdate(
      user._id,
      {username: username, email: email, image: image , password: password},
      {new: true}
    );
    await newProfile.save();
    res.status(200).json(newProfile);
}catch (err) {
  return res.status(400).send(err.message);
}
}

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const username=req.body.username
  const image=req.body.image
  if (email === undefined || password === undefined) {
    return res.status(400).send("Email and password are required");
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      image: image,
      username:username,
      email: email,
      password: hashedPassword,
    });
    return res.send(newUser);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};



const generateTokens = async (
  user: Document<unknown, object, IAuthUser> &
    IAuthUser &
    Required<{
      _id: string;
    }>
): Promise<{ accessToken: string; refreshToken: string }> => {
  // generate token
  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
  const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    process.env.TOKEN_SECRET,
    {}
  );
  if (user.tokens == null) {
    user.tokens = [];
  }
  user.tokens=[];
  user.tokens.push(accessToken)
  user.tokens.push(refreshToken);
  try {
    await user.save();
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    return null;
  }
};

const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId });
    if (user == null) {
      return res.status(400).send("User does not exists");
    }
    const profileUser = {username:user.username,email:user.email,image:user.image}
    return res.status(200).send(profileUser);
}catch (err) {
  return res.status(400).send(err.message);
}
}

const login = async (req: Request, res: Response) => {
  // get email & pwd
  const email = req.body.email;
  const password = req.body.password;
  if (email === undefined || password === undefined) {
    return res.status(400).send("Email and password are required");
  }

  // get user from DB
  try {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(400).send("User does not exists");
    }
    // compare pwd
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    // generate token
    const tokens = await generateTokens(user);
    if (tokens == null) {
      return res.status(400).send("Error generating tokens");
    }
    return res.status(200).send(tokens);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const client = new OAuth2Client();
const googleSignin = async (req: Request, res: Response) => {
  const credential = req.body.credential;
  console.log(credential)
  try {
  const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: process.env.GOOGLE_CLIENT_ID+".apps.googleusercontent.com",
  });

  const payload = ticket.getPayload();
  const email = payload?.email;
 let user = await User.findOne({ 'email': email });
 if (user == null) {
 user = await User.create(
 {
  'email': email,
  'image': payload?.picture,
  'password': 'google-signin',
  'username':payload.name+" G"
 });
 }
 await user.save
 const tokens = await generateTokens(user)
 return res.status(200).send(tokens);
  
  } catch (err) {
  return res.status(400).send("error missing email or password");
  }
  
 }
 
const refresh = async (req: Request, res: Response) => {
  const refreshToken = extractToken(req);
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err, data: jwt.JwtPayload) => {
        if (err) {
          return res.sendStatus(403);
        }
        const user = await User.findOne({ _id: data._id });
        if (user == null) {
          return res.sendStatus(403);
        }
        if (!user.tokens.includes(refreshToken)) {
          //user hacked
          user.tokens = []; //invalidate all user tokens
          await user.save();
          return res.sendStatus(403);
        }
        // user.tokens = user.tokens.filter((token) => token !== refreshToken);
        const tokens = await generateTokens(user);
        if (tokens == null) {
          return res.status(400).send("Error generating tokens");
        }
        return res.status(200).send(tokens);
      }
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const extractToken = (req: Request): string => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
}

const logout = async (req: Request, res: Response) => {
  const refreshToken = extractToken(req);

  if (refreshToken == null) {
      return res.sendStatus(401);
  }

  try {

      const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET) as jwt.JwtPayload;

      const user = await User.findOne({ _id: decoded._id });

      if (!user || !user.tokens.includes(refreshToken)) {

          return res.sendStatus(403);
      }

      user.tokens = [];
      await user.save();

      return res.status(200).send();
  } catch (err) {
      console.error("Error logging out:", err);
      return res.status(400).send(err.message);
  }
};

export const getUserName=async (req: Request):Promise<string> => {
  try {
    const user:IAuthUser = await User.findOne({_id:req.body.userId});
    return (user.username);
  } catch (err) {
    return (err.message);
  }
}
export type AuthRequest = Request & { user: { _id: string } };

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token == null) {
      return res.sendStatus(401);
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, data: jwt.JwtPayload) => {
      if (err) {
          return res.sendStatus(403);
      }
      const id = data._id;
      req.user = { _id: id };
      return next();
  });// as { _id: string };
}

export default { put,register, login, logout, authMiddleware, refresh,googleSignin , getProfile , getUserName , updateProfile};