// import MongoClient from "mongodb"
// const MongoClient = require(“mongodb”).MongoClient;
import { MongoClient } from 'mongodb'
// import { Product } from "../Models/ProductModel.js";
import { User } from "../Models/UserModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import express from "express";
import { generateToken } from "../utils/generateToken.js";
import { protect } from "../MiddleWare/AuthMiddleware.js";

const userRouter = express.Router()

userRouter.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && await (user.matchPassword(password))) {
    req.session.user = user

    res.json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt

    })
    // console.log(res);
  } else {
    console.log('====================================');
    console.log('invalid email');
    console.log('====================================');
    res.status(401)
    throw new Error('Invalid Email or Password')
  }
}))

userRouter.post('/logout', asyncHandler(async (req, res) => {
  console.log('hiii')
  MongoClient.connect(process.env.MONGO_URL, function (err, client) {
    if (err) console.log(err);
    let db = client.db('wigostore');
    if (req.session && req.session.user) {
      const datas = db.collection('session').deleteOne({ _id: req.session.user._id })
    }
    req.session.destroy(() => {
      console.log('logged out,sessions must be deleted in the database');
      res.clearCookie("userId", {
        path: '/',
        httpOnly: true,
      }).sendStatus(200)
    })
  })
}))

// create the new user ...SIGNIN
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('hii22');

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (userExists) {
      res.status(400);
      console.log('====================================');
      console.log('hii345');
      console.log('====================================');
      throw new Error("User already exists");

    }

    const user = await User.create({

      email,
      password,
    });
    console.log('====================================');
    console.log('hii', user);
    console.log('====================================');
    if (user) {
      res.status(201).json({
        _id: user._id,

        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),

      });
      console.log('hii33');

    } else {
      res.status(400);
      console.log('hii44');
      throw new Error("Invalid User Data");

    }
  })
);
export default userRouter;