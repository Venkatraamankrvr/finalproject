import { Cart } from "../Models/CartModel.js";
import { Coupon } from "../Models/DiscountsModel.js";
import express from "express";
import { useParams } from 'react-router';
const discountRoute = express.Router();

discountRoute.post("/addcoupon", async (req, res) => {
  const discountdetails = req.body
  console.log('hii2');
  try {

    const newDiscount = await Coupon.create({ ...req.body })

    res.status(200).send(newDiscount)

  } catch (error) {
    console.log('hii5');

    // res.status(404).send(error.message)

    console.log('Coupon');
    // console.log(error, '--------');
    res.status(404).send("Somethig wrong to add a new coupon. Please try again")
    console.log('hii6');

  }
  // console.log(discountdetails);
})

discountRoute.post('/verifyCoupon', async (req, res) => {

  const { cartData } = req.body
  const coupon = cartData.couponCode
  const userId = cartData.userId
  let cart = await Cart.findOne({ userId })

  // console.log(cart);
  const CurrentCoupon = await Coupon.findOne({ code: coupon })

  if (CurrentCoupon) {
    let couponId = CurrentCoupon._id.toString()
    let couponCode = CurrentCoupon.code
    if (CurrentCoupon.status === "enable") {
      if (new Date().getTime() > CurrentCoupon.startDate.getTime() && new Date().getTime() < CurrentCoupon.endDate.getTime()) {
        cart.discount.push(

          { couponId }
        )
        console.log(couponCode);
        cart.couponCode = couponCode;
        cart = await cart.save()
        res.status(200).send(CurrentCoupon)

      }
      else {
        console.log('Coupon is already expired....');
        res.status(200).send(CurrentCoupon)

      }
    }
    else {
      console.log("coupon is not enabled");
      res.status(200).send(CurrentCoupon)


      // res.status(200).send(CurrentCoupon)

    }
  } else {
    let error = "no coupon"

    res.status(200).send(error
    )

    console.log('Coupon not found');
  }

})
// discountRoute.post('/verifyCoupon', async (req, res) => {

//   const { total, coupon, userId } = req.body
//   // console.log(total, coupon, userId);
//   let cart = await Cart.findOne({ userId })
//   // console.log(cart.couponCode, 345678)
//   const CurrentCoupon = await Coupon.findOne({ code: coupon })
//   const discountdetails = {
//     cart, CurrentCoupon
//   }
//   res.status(200).send(discountdetails)

// if (CurrentCoupon) {
//   // console.log(CurrentCoupon.code);
//   if (CurrentCoupon.status === "enable") {
//     if (new Date().getTime() > CurrentCoupon.startDate.getTime() && new Date().getTime() < CurrentCoupon.endDate.getTime()) {
//       // console.log(CurrentCoupon, 'oiiuhj');
//       if (total > 0) {

//         let discount;
//         // console.log(CurrentCoupon);
//         if (CurrentCoupon && CurrentCoupon.products1.length === 0) {
//           discount = Math.round((total * CurrentCoupon.value) / 100);
//           // console.log(total, coupon, discount, 'ojijjo');
//           let couponId = CurrentCoupon._id
//           let couponCode = CurrentCoupon.code
//           const discountdetails = {
//             isDiscounted: true,
//             discount,
//             appliesforAll: true,

//             total, coupon,
//             finalAmount: total - discount,
//             message: `${discount} dollars were discounted`
//           }
//           // console.log(discountdetails);
//           console.log('specify 1');
//           // console.log('====================================');
//           // console.log(couponCode);
//           // console.log('====================================');

//           if (discount !== undefined) {
//             // console.log(couponId, "couponid");

//             cart.discount.push(
//               { couponId }
//             )
//             cart.couponCode = couponCode;
//           }

//           cart = await cart.save()

//           // console.log(cart);

//           return res.status(200).send(discountdetails);
//         }
//         else {
//           console.log('specify some products 2')
//           if (CurrentCoupon && CurrentCoupon.products1.length > 0) {
//             // console.log(cart.products.map(product => product.productId._id), "cart");
//             const cartProductId = cart.products.map(product => product.productId._id.toString())
//             const discountProductId = CurrentCoupon.products1.map(product => product.productId._id.toString())
//             // console.log('====================================');
//             // console.log(cartProductId, discountProductId);
//             // console.log('====================================');
//             // console.log(CurrentCoupon.products1.map(product => product.productId._id));

//             const comparison = (arr1, arr2) => {
//               const finalArray = [];
//               // console.log('hiii');
//               // console.log(arr1, arr2);
//               arr1.forEach((e1) => arr2.forEach((e2) => {
//                 if (e1 === e2) {
//                   finalArray.push(e1)
//                   console.log(e1);
//                 }
//               }))

//               return finalArray;
//             }
//             const discountableProductIds = comparison(cartProductId, discountProductId)
//             // console.log('====================================');
//             // console.log('62408bb380c36478c553bfe3' == '62408bb380c36478c553bfe3');
//   //               // console.log(discountableProductIds);

//   //               let nonDiscountableProductIds = cartProductId.filter((el) => !discountableProductIds.includes(el));
//   //               if (discountableProductIds.length === 0) {
//   //                 console.log('there is no discountable product');
//   //                 const discountdetails = {
//   //                   isDiscounted: false,
//   //                   appliesforAll: false,

//   //                   coupon, discountableProductIds, nonDiscountableProductIds,

//   //                   message: `${coupon} Coupon is applicable for specific products Only`
//   //                 }
//   //                 return res.status(201).send(discountdetails)
//   //               }

//   //               // console.log(nonDiscountableProductIds);
//   //               // console.log('====================================');
//   //               // const remove = cart.products[0].productId._id;
//   //               // console.log(remove.toString());
//   //               let discountValue = CurrentCoupon.value / 100
//   //               let couponId = CurrentCoupon._id
//   //               let couponCode = CurrentCoupon.code
//   //               // console.log(couponId);


//   //               const discountdetails = {
//   //                 isDiscounted: true,
//   //                 appliesforAll: false,
//   //                 discountValue,
//   //                 coupon, discountableProductIds, nonDiscountableProductIds,

//   //                 message: `Discounts were applied for specific products`
//   //               }

//   //               cart.discount.push(
//   //                 { couponId }
//   //               )
//   //               cart.couponCode = couponCode;
//   //               // console.log(couponId, couponCode);

//   //               cart = await cart.save()
//   //               // console.log(discountdetails);
//   //               res.status(200).send(discountdetails)
//   //             }
//   //           }
//   //         }

//   //       }
//   //       else {
//   //         console.log('3');

//   //         const discountdetails = {
//   //           isDiscounted: false,
//   //           message: "Coupon Code is Expired.Please try Another Coupon Code"

//   //         }
//   //         return res.status(200).send(discountdetails)
//   //       }
//   //     }
//   //   }
//   //   else {
//   //     console.log('specify6');
//   //     const discountdetails = {
//   //       isDiscounted: false,
//   //       message: `Coupon Code is Invalid. Please try Another Coupon Code`

//   //     }
//   //     return res.status(200).send(discountdetails);

//   //   }
//   // } catch (error) {
//   //   console.log(error);
//   //   console.log('5');

//   //   return res.status(500).send("Something went wrong in server. Please try Another Coupon Code")
//   // }

// })

discountRoute.delete('/removecoupon/:userId', async (req, res) => {
  // const userId = req.body.userId
  const userId = req.params.userId
  console.log(userId, "remove");
  try {
    let cart = await Cart.findOne({ userId })
    // console.log(cart, "nknkm");
    cart.discount = []
    cart.couponCode = ""
    // cart.products.productId.discountValue = 0;
    // cart.products.productId.discountCode = "";

    cart = await cart.save();
    // console.log(cart);
    const discountdetails = {
      isDiscounted: false,
      discount: 0,
      message: "Discount Coupon was removed"
    }

    return res.status(201).send(discountdetails)
  } catch (error) {
    console.log(error);
    res.status(500).send("Coupon cannot be removed,something went wrong");
  }
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

//   if (!product) {
//     return res.status(500).send({ meassge: "No product found with that ID" });
//   } else {
//     return res.status(200).send({
//       status: "success",
//       product,
//     });
//   }
// });
// update the discounts with id in admin side
discountRoute.post('/updatediscounts', async (req, res) => {
  // console.log(req.body.object, 'coupon body');
  const currentcoupon = req.body.couponId
  // const CurrentCoupon = await Coupon.findById({ _id: currentcoupon })
  const CurrentCoupon = await Coupon.findByIdAndUpdate({ _id: currentcoupon }, { $set: { ...req.body.object } }, { new: true })
  console.log(CurrentCoupon);
})

// admin discounts list api
discountRoute.post('/discountlists', async (req, res) => {
  const discountDetails = await Coupon.find()
  res.status(200).send(discountDetails)
})

// get single coupon details 
discountRoute.post('/onecoupondetails', async (req, res) => {
  const singleCouponDetails = await Coupon.findOne({ _id: req.body.id })
  res.status(200).send(singleCouponDetails);
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

//   if (!product) {
//     return res.status(500).send({ meassge: "No product found with that ID" });
//   } else {
//     return res.status(200).send({
//       status: "success",
//       product,
//     });
//   }
// });
discountRoute.post('/updatediscounts', async (req, res, next) => {
  try {

    const discountDetails = await Coupon.findByIdAndUpdate(
      { _id: req.body.id }, { $set: { ...req.body.data } }
    )
    res.status(200).send(discountDetails)
  } catch (error) {
    console.log(error);
  }
})


discountRoute.post('/discountCountersIncrement', async (req, res) => {
  let discountDetails = await Coupon.findOneAndUpdate({ code: req.body.discountCode }, { $inc: { counters: 1 } }, { new: true })
})

discountRoute.post('/discountCountersDecrement', async (req, res) => {
  let discountDetails = await Coupon.findOneAndUpdate({ code: req.body.discountCode }, { $inc: { counters: -1 } }, { new: true })
})


// cartRoute.post('/deletedocumentcart', async (req, res) => {
//   const cart = await Cart.deleteOne({ userId: req.body.userId })
//   console.log(cart);
//   res.status(200).send(cart);
// })
discountRoute.post('/deletecoupon', async (req, res) => {
  const discountDetails = await Coupon.deleteOne({ _id: req.body.id })
  console.log(discountDetails);
})
export default discountRoute;