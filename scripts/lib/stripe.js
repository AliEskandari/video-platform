const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY);
module.exports = stripe;
