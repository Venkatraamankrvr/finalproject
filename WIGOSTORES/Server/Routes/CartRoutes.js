import { Cart } from "../Models/CartModel.js";
import { Product } from "../Models/ProductModel.js";
import express from "express";
const cartRoute = express.Router();

// getting the cart for particular users
cartRoute.get('/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('====================================');
  console.log(userId);
  console.log('====================================');
  try {
    let cart = await Cart.findOne({ userId: userId })
    if (cart) {
      console.log('hiiii1');
      if (cart && cart.products.length > 0) {
        console.log('hiiii2');

        res.send(cart);
      } else {
        console.log('hiiii3');
        cart.discount = [],
          cart.couponCode = '',
          cart = await cart.save()
        res.send(cart);
        console.log(cart);
      }
    } else {
      console.log('hiiii4');

      const newCart = await Cart.create(
        {
          userId,
          products: [],
          bill: 0,

        })
      console.log(newCart);
      return res.status(201).send(newCart)
    }

  }
  catch (err) {
    console.log(err);
    console.log('hiiii');
    res.status(500).send("Something went Wrong!");
  }
})

// adding products to cart
cartRoute.post('/addtocart/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId, quantity })
    let product = await Product.findOne({ _id: productId })
    console.log(product)


    if (!product) {
      res.status(404).send("Product not found!")
    }


    let price = product.price
    console.log(product.price, "===============")
    if (cart) {

      // if cart exists for user
      let productIndex = cart.products.findIndex(p => p.productId.sku === product.sku
      );
      // Check if product exists or not
      if (productIndex > -1) {
        let productItem = cart.products[productIndex]
        // const checkInventory = productItem.quantity < productItem.productId.countInStock
        const checkInventory = quantity <= productItem.productId.countInStock


        if (checkInventory) {

          productItem.quantity = (productItem.quantity * 1) + (quantity * 1)
          cart.products[productIndex] = productItem
        } else {
          cart.error = "Cant buy this quantity"

          return res.status(201).send(cart)
        }
      } else {
        cart.products.push({ productId, quantity })
        console.log(cart, "===============================")

      }

      cart.bill = (cart.bill * 1) + (quantity * 1) * (product.price * 1)




      cart = await cart.save()

      return res.status(201).send(cart)

    }
    else {
      // no cart exists, createone
      const newCart = await Cart.create(
        {
          userId,
          products: [{ productId, quantity, price }],
          bill: quantity * price
        })
      console.log(newCart);
      return res.status(201).send(newCart)
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong :(")
  }

})

// updating cart products
cartRoute.put('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { sku, qty } = req.body;
  console.log(userId, sku, qty);

  try {
    let cart = await Cart.findOne({ userId })
    // console.log(cart);
    let product = await Product.findOne({ sku: sku })
    // console.log(product);

    if (!product)
      return res.status(404).send("Product not Found!")
    if (!cart) return res.status(400).send("Cart not Found!")
    else {
      // console.log(cart.products.findIndex(product => product.productId.sku));
      // if cart exists for an user
      let productIndex = cart.products.findIndex(p => p.productId.sku === sku)
      // console.log(cart.products.map(p => p.productId.sku));
      // console.log(productIndex, 13);
      // cart.products.forEach((p) => {
      //   if (p.productId.includes(productId)) {
      //     console.log(p, "=======================================")
      //   }
      // })

      // console.log(cart.products);

      // check if products exists or not
      if (productIndex == -1) return res.status(404).send("Product not found in the cart!")
      else {
        let productItem = cart.products[productIndex]
        // console.log(productItem, 11233, qty);
        // if (productItem.quantity === qty) return res.status(400).send("Cart is already in up-to-date state with quantity " + productItem.quantity + "s")
        if (productItem.quantity === qty) {

          console.log('cart is already in up-to-date states');
          return res.status(200).send(cart)
        }
        if (qty === 0) { return res.status(201).send("Invalid Cart Quantity") }

        productItem.quantity = qty;
        // console.log(productItem, 0);
        cart.products[productIndex] = productItem
      }
      // console.log(cart.products.reduce((sum) => cart.bill, sum.productId.price, 0)
      // );
      // console.log(cart.products.map(p => p.productId.price, cart));
      // console.log(cart, 0);
      // let bill = cart.bill
      // let newbill = cart.products.reduce(p => p.productId.price * p.productId.quantity, 0)
      // console.log(newbill);
      // let productee = cart.products.productId

      // const sum = [1, 2, 3].reduce((partialSum, a) => partialSum + a, 0);
      // console.log(sum);
      const pricevar = (cart.products.map(p => p.productId.price * p.quantity));
      console.log(pricevar, 134);
      console.log('====================================');
      let sums = (pricevar.reduce((partialSum, a) => partialSum + a, 0));
      console.log('====================================', cart.bill);
      cart.bill = 0;
      cart.bill = sums + cart.bill
      console.log('====================================', cart.bill);
      // let sums =
      //   console.log(pricevar.reduce(
      //     (sum, product) => sum + product, 0
      //   ));

      // cart.bill = cart.products.reduce((sum, product) => sum + product.price * product.quantity, 0)
      cart = await cart.save()
      return res.status(201).send(cart)
    }

  } catch (error) {
    console.log("Error in updating the cart", error);
    res.status(500).send("Something Went went wrong ;(")
  }
})

cartRoute.delete('/:userId/:sku', async (req, res) => {
  const userId = req.params.userId;
  const sku = req.params.sku;
  console.log(userId, sku, 8999);
  try {
    let cart = await Cart.findOne({ userId })
    console.log(cart.products.findIndex(p => p.productId.sku === sku), 999)
    let productIndex = cart.products.findIndex(p => p.productId.sku == sku);
    if (productIndex > -1) {
      let productItem = cart.products[productIndex];
      // console.log(productItem.quantity, productItem.productId.price, cart.bill);
      // cart.bill = 0
      console.log(cart.bill, productItem.quantity, productItem.productId.price);

      cart.bill = cart.bill - productItem.quantity * productItem.productId.price
      console.log('====================================');
      console.log(cart.bill);
      console.log('====================================');
      // cart.bill -= productItem.quantity * productItem.price;
      cart.products.splice(productIndex, 1);
    }
    cart = await cart.save();
    return res.status(201).send(cart)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
})
cartRoute.post('/deletedocumentcart', async (req, res) => {
  const cart = await Cart.deleteOne({ userId: req.body.userId })
  console.log(cart);
  res.status(200).send(cart);
})

// adminProductRouter.post("/updateproduct", async (req, res, next) => {

//   const product = await Product.findByIdAndUpdate(
//     {
//       _id: req.body.id,
//     },
//     {
//       $set: { ...req.body.products1 },
//     }
//   );
// cartRoute.post('/cartUpdates', async (req, res) => {
//   console.log('----------------');
//   console.log(req.body);
//   const cart = await Cart.findOneAndUpdate({ _id: req.body.userId }, { $set: { products: { ...req.body.products } } }, { new: true }, function (err, result) {
//     if (err) {
//       console.log(err, 'ERROR');
//     }
//     console.log("RESULT: " + result);
//     res.send('Done')
//   })
//   // console.log(cart, 'bjjklnlknlk');
//   // res.status(200).send(cart);
// })
cartRoute.post('/cartUpdates', async (req, res) => {
  console.log(req.body.userId, '----------')
  console.log(req.body.products, '--------')
  const cart = await Cart.findOneAndUpdate({ userId: req.body.userId }, {
    $set: { products: req.body.products }
  }, { new: true })
  res.status(200).send(cart)
})
export default cartRoute;
