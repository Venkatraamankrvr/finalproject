import { Product } from "../Models/ProductModel.js";
import asyncHandler from "express-async-handler";
import express from "express";
const productRoute = express.Router();

// getting all products
productRoute.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
}))


// getting single product
productRoute.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    // res.status(404).send("Failed to fetch product")
    throw new Error("Product not found")
  }
}))

productRoute.post('/inventorydecrement', asyncHandler(async (req, res) => {
  const productId = req.body.productId
  const quantity = req.body.quantity
  console.log(productId, quantity);
  const product = await Product.findByIdAndUpdate({ _id: productId }, { $inc: { countInStock: - quantity } }, { new: true })
  console.log(product);
  res.status(200).send(product)
}))
productRoute.post('/inventoryincrement', asyncHandler(async (req, res) => {
  const productId = req.body.productId
  const quantity = req.body.quantity
  console.log(productId, quantity);
  const product = await Product.findByIdAndUpdate({ _id: productId }, { $inc: { countInStock: quantity } }, { new: true })
  console.log(product);
  res.status(200).send(product)
}))


export default productRoute;