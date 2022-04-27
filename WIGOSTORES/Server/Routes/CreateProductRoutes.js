import { Product } from "../Models/ProductModel.js";
import express from "express";
import multer from "multer";
import path from "path";

const adminProductRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "../ecommerce-app/public/images");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-venkat.jpeg`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

adminProductRouter.post("/addimage", upload.single("images"), async (req, res) => {
  return res.send(`/images/${req.file.filename}`);
});
adminProductRouter.post("/createproduct", async (req, res) => {
  try {
    const product = await Product.create(req.body.products);
    console.log(product);
    // console.log(product);
    return res.status(200).send({
      status: "success",
      product,
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(404).send({
      message: "Something went wrong",
    });
  }
});


adminProductRouter.post("/updateproduct", async (req, res, next) => {
  try {

    const product = await Product.findByIdAndUpdate(
      {
        _id: req.body.id,
      },
      {
        $set: { ...req.body.products1 },
      }
    );

    if (!product) {
      return res.status(500).send({ meassge: "No product found with that ID" });
    } else {
      return res.status(200).send({
        status: "success",
        product,
      });
    }
  } catch (error) {
    console.log('------------------');
    console.log(error);
    res.status(500).send({ status: "error" })
  }

});
adminProductRouter.get("/:id", async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    console.log("Failed to find product");
  }
});
export default adminProductRouter;