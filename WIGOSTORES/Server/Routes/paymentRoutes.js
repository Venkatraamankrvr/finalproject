// import { OrderDetails } from '../../ecommerce-app/src/screens/OrderDetails';
import Stripe from "stripe";
import express from "express";
const paymentRoute = express.Router();

paymentRoute.post("/payement", async (req, res, next) => {
  console.log(req.body.orderDetails.orderDetails.OrderNo);
  const stripe = new Stripe(process.env.STRIPE_SECERET_KEY, {
    apiVersion: "2020-08-27",
  });
  let line_items = req.body.lineitem;
  // let order = req.body.order;
  // console.log(line_items);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    success_url: `http://localhost:3000/ordersuccess/${req.body.orderDetails.orderDetails.OrderNo}`,
    cancel_url: `http://localhost:3000/checkout/${req.body.orderDetails.orderDetails.OrderNo}`,
  });

  return res.status(200).json({
    status: "success",
    session,
  });
});
export default paymentRoute;
