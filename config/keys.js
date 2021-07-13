const dotenv = require('dotenv');
const path = require('path');
const env = process.env.NODE_ENV;

dotenv.config({path: path.join(__dirname, `../.env.${env}`)});

console.log(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY
};


