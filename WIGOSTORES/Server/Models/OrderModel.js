import { User } from "./UserModel.js";
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  OrderNo: {
    type: Number,
    // required: [true],
    unique: [true, , "OrderNo already exist"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",

  },
  info: {
    type: Object,
  }, subTotal: {
    type: Number
  }, total: {
    type: Number
  },
  discountCode: {
    type: String,

  },
  amount: {
    type: String,
  },
  totaldiscount: {
    type: Number,
  },
  paymentstatus: {
    type: String,
    default: "Pending",
  },
  createdate: {
    type: Date,
    default: Date.now,
  },
  fulfilmentstatus: {
    type: String,
    default: "UnFullfilled",
  },

  data: {
    type: Object,
  },
});

orderSchema.pre("save", async function (next) {
  this.populate("userId");
  next();
});
orderSchema.pre(/^find/, function (next) {
  this.populate("userId");
  // this.populate("discount.couponId");
  next();
});
export const Order = mongoose.model("Order", orderSchema);
