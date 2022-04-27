import { Product } from "./ProductModel.js"
import { User } from "./UserModel.js"
import mongoose from "mongoose";
// var uniqueValidator = require('mongoose-unique-validator');

const discountSchema = mongoose.Schema({
  startDate: Date,
  endDate: Date,
  status: String,
  code: {
    type: String,
    required: true,
    unique: true,
  },
  counters: {
    type: Number,
    default: 0
  },
  // appliesTo: String,
  products1: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: Product,
        required: ['true', "Cart Must Have One Product"]
      }
    }
  ],
  value: {
    type: Number,
    required: true,

  },

})

discountSchema.pre('save', function (next) {
  this.populate("products1.productId");

  next();
});

discountSchema.pre(/^find/, function (next) {
  this.populate("products1.productId");

  next();
});
export const Coupon = mongoose.model("Coupon", discountSchema);

