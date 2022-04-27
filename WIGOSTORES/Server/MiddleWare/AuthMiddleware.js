import { User } from "../Models/UserModel.js"
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const protect = asyncHandler(
  async (req, res, next) => {

    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded, "14");
        req.user = await User.findById(decoded.id).select("-password")
        next()

      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not Authorized, the token failed to be authorized")
      }
    }

    if (!token) {
      res.status(401)
      throw new Error('Not Authorized,no token!')
    }
  })