// import isEmail from "validator/lib/isEmail";
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    default: 'available',
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: [true, 'It should be unique'],
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  }, discountCode: {
    type: String, default: ""
  }, discountValue: {
    type: Number, default: 0
  }
},
  {
    timestamps: true,
  })

export const Product = mongoose.model("Product", productSchema);