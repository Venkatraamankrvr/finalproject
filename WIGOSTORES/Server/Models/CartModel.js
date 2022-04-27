import { Coupon } from "./DiscountsModel.js";
import { Product } from "./ProductModel.js"
import { User } from "./UserModel.js"
import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: User,
  //   unique: true,
  // },
  // items: [{
  //   productId: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: Product,
  //   },
  //   name: String,
  //   quantity: {
  //     type: Number,
  //     required: true,
  //     min: [1, 'Quantity can not be less then 1.'],
  //     deafult: 1
  //   },
  //   price: Number
  // }],
  // bill: {
  //   type: Number,
  //   required: true,
  //   default: 0
  // }
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    unique: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: Product,
        required: ['true', "Cart Must Have One Product"]
      }, quantity: {
        type: Number,
      }
    }
  ], bill: {
    type: Number,
    required: true,
    default: 0
  },
  discount: [
    {
      couponId: {
        type: mongoose.Schema.ObjectId,
        ref: Coupon,


      },
    }
  ],
  couponCode: {
    type: String,


  }
  // ============================
  // products: [{
  //   productId: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: Product,

  //   },
  //   name: String,
  //   quantity: {
  //     type: Number,
  //     required: true,
  //     min: [1, 'Quantity can not be less then 1.'],
  //     deafult: 1
  //   },
  //   price: Number
  // }],
  // bill: {
  //   type: Number,
  //   required: true,
  //   default: 0
  // }
})
// module.exports = Cart = mongoose.model('cart', CartSchema);
cartSchema.pre('save', function (next) {
  this.populate("products.productId");
  this.populate("discount.couponId")
  next();
});

cartSchema.pre(/^find/, function (next) {
  this.populate("products.productId");
  this.populate("discount.couponId")

  next();
});



export const Cart = mongoose.model("Cart", cartSchema);