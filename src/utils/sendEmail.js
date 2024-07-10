import nodemailer from 'nodemailer';
import 'dotenv/config';
const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;
//
//
//
const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465, //25,465,2525
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

export const transport = nodemailer.createTransport(nodemailerConfig);

// const data = {
//   from: UKR_NET_EMAIL,
//   to: 'pedoc10481@cartep.com',
//   subject: 'test amail',
//   html: '<strong>Test email</strong>',
// };
// transport
//   .sendMail(email)
//   .then(() => console.log('Email send successful'))
//   .catch((error) => console.log(error.message));

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;
