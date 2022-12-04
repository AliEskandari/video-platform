const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const stripe = require("./stripe");
const getSubscriptionPriceId = require("./getSubscriptionPriceId");
const STRIPE_CLIENT_ID = functions.config().stripe.client_id;
const jwt = require("jsonwebtoken");

// ============================================================================
// Callable Functions
// ============================================================================

exports.getStripeAccountLink = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const host = data.host;
    const user = await db.collection("users").doc(userId).get();
    const stripeAccountId = user.data().stripeAccountId;

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${host}/my/banking`,
      return_url: `${host}/my/banking`,
      type: "account_onboarding",
    });
    return accountLink;
  });

exports.getAuthLink = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const host = data.host;
    const userId = data.userId;
    const token = jwt.sign({ host, userId }, "secret_domum");
    // request.session.state = state;
    const args = new URLSearchParams({
      state: token,
      client_id: STRIPE_CLIENT_ID,
    });
    const url = `https://connect.stripe.com/express/oauth/authorize?${args.toString()}`;
    return { url };
  });

exports.getStripeAccountLoginLink = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const user = await db.collection("users").doc(userId).get();
    const stripeAccountId = user.data().stripeAccountId;
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);

    return loginLink;
  });

exports.createSetupIntent = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const user = await db.collection("users").doc(userId).get();
    const stripeCustomerId = user.data().stripeCustomerId;

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
    });
    return { clientSecret: setupIntent.client_secret };
  });

exports.savePaymentMethod = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const paymentMethodId = data.paymentMethodId;
    const user = await db.collection("users").doc(userId).get();
    const stripeCustomerId = user.data().stripeCustomerId;

    const customer = await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // store payment method id with user
    await user.ref.update({ stripePaymentMethodId: paymentMethodId });

    return customer;
  });

exports.createSubscription = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const channelUserId = data.channelUserId;

    const user = await db.collection("users").doc(userId).get();
    const channelUser = await db.collection("users").doc(channelUserId).get();
    const stripeCustomerId = user.data().stripeCustomerId;
    const stripeAccountId = channelUser.data().stripeAccountId;
    const subscriptionPriceId = await getSubscriptionPriceId;

    try {
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [
          {
            price: subscriptionPriceId,
          },
        ],
        expand: ["latest_invoice.payment_intent"],
        application_fee_percent: 39.93,
        metadata: {
          userId: userId,
          channelUserId: channelUserId,
        },
        transfer_data: {
          destination: stripeAccountId,
        },
      });

      return subscription;
    } catch (error) {
      if (error.code === "resource_missing") {
        throw new functions.https.HttpsError(
          "aborted",
          "Missing payment method.",
          error
        );
      } else {
        throw new functions.https.HttpsError("aborted", error.message, error);
      }
    }
  });

exports.cancelSubscription = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const subscriptionId = data.subscriptionId;
    const canceledSubscription = stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return canceledSubscription;
  });

exports.reactivateSubscription = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const subscriptionId = data.subscriptionId;
    const reactivatedSubscription = stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

    return reactivatedSubscription;
  });

exports.deleteSubscription = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const subscriptionId = data.subscriptionId;

    // delete subscription
    const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

    return deletedSubscription;
  });

exports.getPaymentMethods = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const user = await db.collection("users").doc(userId).get();
    const stripeCustomerId = user.data().stripeCustomerId;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });

    return paymentMethods.data;
  });

exports.deletePaymentMethod = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const paymentMethodId = data.paymentMethodId;
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

    return paymentMethod.data;
  });

exports.getAccount = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    const user = await db.collection("users").doc(userId).get();
    const stripeAccountId = user.data().stripeAccountId;
    if (stripeAccountId) {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      return account;
    } else {
      //  no connected account
      return {};
    }
  });

exports.deleteAccount = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const stripeAccountId = data.stripeAccountId;
    if (stripeAccountId) {
      await stripe.accounts.del(stripeAccountId);
    }
  });
