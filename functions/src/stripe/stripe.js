const functions = require("firebase-functions");

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
let key = functions.config().stripe.key;

const stripe = require("stripe")(key);

module.exports = stripe;
