import { Order } from "../Models/OrderModel.js";
// import { connectDatabase } from "../config/MongoDb.js";
import express from "express";
const orderRoute = express.Router()
orderRoute.post('/orderCheckout', async (req, res) => {
  console.log(req.body);
  const ordernum = await Order.find().sort({ OrderNo: -1 })
  const num = ordernum[0].OrderNo + 1;
  try {
    const orderDetails = await Order.create(
      {
        OrderNo: num,
        userId: req.body.userId,
        info: req.body.info,
        data: req.body.datas,
        subTotal: req.body.subTotal,
        total: req.body.total,
        discountCode: req.body.discountCode
      }
    )
    return res.status(200).send({ status: 'success', orderDetails })
  } catch (error) {
    console.log('error occured while processing the orders');
  }
})

orderRoute.post('/orderDetails', async (req, res) => {
  const orderNo = req.body.orderno
  console.log(orderNo);
  if (orderNo) {
    // let cart = await Cart.findOne({ userId: userId })

    let OrderDetails = await Order.findOne({ OrderNo: orderNo })
    // console.log(OrderDetails);
    res.status(200).json({ OrderDetails })
  }
})

orderRoute.post('/myOrdersPage', async (req, res) => {
  const userId = req.body.userId;
  console.log(userId, "kgkuhbnln");
  let OrderDetails = await Order.find({ userId })
  // console.log(OrderDetails);
  res.status(200).json({ OrderDetails })


})

// getting all the orders
orderRoute.get('/orderslists', async (req, res) => {
  let orderList = await Order.find()
  console.log(orderList);
  res.status(200).json({ orderList })
})

// changing the payment status to paid
orderRoute.post('/paymentstatus', async (req, res) => {
  console.log(req.body);
  const orderNo = req.body.orderno
  let OrderDetails = await Order.findOneAndUpdate({ OrderNo: orderNo }, { paymentstatus: 'Paid' }, { new: true })
  console.log(OrderDetails);


})
export default orderRoute;
