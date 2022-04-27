import express from "express";
import nodemailer from 'nodemailer';
const emailRoute = express.Router();
emailRoute.post('/confirmemail', async (req, res) => {
  const messages = req.body.message;
  const to = req.body.to;
  const subject = req.body.subject;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD,
    },
  });
  const message = {
    from: `venkatraamankr19@gmail.com`,
    to: "Venkatraamankr",
    subject: subject,
    html: messages,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    }
  });
})
export default emailRoute;