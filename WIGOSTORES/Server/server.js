import { errorHandler, notFound } from "./MiddleWare/Errors.js";

import ImportData from "./DataImport.js";
// import MongoDBStore from "connect-mongodb-session";
import adminProductRouter from "./Routes/CreateProductRoutes.js";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
import cartRoute from "./Routes/CartRoutes.js";
import { connectDatabase } from "./config/MongoDb.js";
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import discountRoute from "./Routes/DiscountRoutes.js";
import dotenv from "dotenv";
import emailRoute from "./Routes/EmailRoutes.js";
import express from "express";
import orderRoute from "./Routes/OrderRoutes.js";
import paymentRoute from "./Routes/paymentRoutes.js";
import productRoute from "./Routes/ProductRoutes.js";
import session from "express-session";
import userRouter from "./Routes/UserRoutes.js";

const MongoDBStore = connectMongoDBSession(session);

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  })
)
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'session',
  expires: 1000 * 60 * 60 * 24 * 30,
});

// let store = new MongoDBStore({
//   uri: process.env.MONGO_URL,
//   collection: "LoginSessions",
//   expires: 1000 * 60 * 60 * 24 * 30,
// });

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
    },
    store: store,
  })
);

// app.get("/users/mongosessionlogin", (req, res) => {
//   if (req.session.user) {
//     res.send({ loggedIn: true, user: req.session.user });
//   } else {
//     res.send({ loggedIn: false });
//   }
// });


connectDatabase();
// API
app.get("/user/sessions", (req, res) => {
  if (req.session.user) {
    req.session.user.loggedIn = true;

    res.send({ ...req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.use("/images", express.static(`../ecommerce-app/public`));
app.use('/api/import', ImportData)
app.use('/api/products', productRoute)
app.use('/api/users', userRouter)
app.use('/api/carts', cartRoute)
app.use('/api/admin/discount', discountRoute)
app.use('/user/orders', orderRoute)
app.use('/api/stripe', paymentRoute)
app.use('/api/admin', adminProductRouter)
app.use('/mail', emailRoute)

// // getallproducts
// app.get('/api/products', (req, res) => { res.json(products); });

// // getsingleproduct
// app.get('/api/products/:id', (req, res) => {
//   const product = products.find((p) => p._id === req.params.id)
//   res.json(product);
// });

// errors handlers
app.use(notFound)
app.use(errorHandler)

// app.get('/', (req, res) => { res.send("API is running at port 5000") })

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server Running listening to port ${PORT}...`))
