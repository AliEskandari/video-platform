const stripe = require("./stripe");

module.exports = stripe.prices.list({ limit: 1 }).then(function (prices) {
  return prices.data[0].id;
});
