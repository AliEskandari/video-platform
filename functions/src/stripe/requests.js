const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const stripe = require("./stripe");
const jwt = require("jsonwebtoken");

// ============================================================================
// HTTP Requests
// ============================================================================

const endpointSecret = functions.config().stripe.webhook_secret;

exports.webhook = functions.https.onRequest(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log(`Handling event type ${event.type}.`);

  // Handle the event
  switch (event.type) {
    case "invoice.paid":
      handleInvoicePaidEvent(event);
      break;
    case "invoice.payment_failed":
      handleInvoicePaymentFailedEvent(event);
      break;
    case "customer.subscription.deleted":
      handleCustomerSubscriptionDeleted(event);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

exports.authorize = functions.https.onRequest(async (request, response) => {
  const { code, state: token } = request.query;
  const { userId, host } = jwt.verify(token, "secret_domum");

  // Send the authorization code to Stripe's API.
  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code,
    })
    .then(
      async (stripeResponse) => {
        const connected_account_id = stripeResponse.stripe_user_id;
        await db.collection("users").doc(userId).update({
          stripeAccountId: connected_account_id,
        });
        await stripe.accounts.update(connected_account_id, {
          metadata: { userId },
        });

        return response.redirect(301, `${host}/my/banking`);
      },
      (err) => {
        if (err.type === "StripeInvalidGrantError") {
          return response
            .status(400)
            .json({ error: "Invalid authorization code: " + code });
        } else {
          return response
            .status(500)
            .json({ error: "An unknown error occurred." });
        }
      }
    );
});

async function handleInvoicePaidEvent(event) {
  let invoice = event.data.object;
  let subscriptionId = invoice.subscription;
  let subscription = await stripe.subscriptions.retrieve(subscriptionId);
  let {
    current_period_end,
    metadata: { userId, channelUserId },
  } = subscription;

  // update subscription doc to 'active'
  let subscriptionRef = db
    .collection(`subscriptions/${userId}/subscriptions`)
    .doc(channelUserId);
  await subscriptionRef.update({
    status: "active",
    currentPeriodEnd: current_period_end,
  });

  // increment subscriber count
  let channelUserRef = db.collection("users").doc(channelUserId);
  await channelUserRef.update({
    subscriberCount: admin.firestore.FieldValue.increment(1),
  });
}

async function handleInvoicePaymentFailedEvent(event) {
  let invoice = event.data.object;
  let subscriptionId = invoice.subscription;
  let subscription = await stripe.subscriptions.retrieve(subscriptionId);
  let { userId, channelUserId } = subscription.metadata;

  // update subscription doc to 'incomplete'
  let subscriptionRef = db
    .collection(`subscriptions/${userId}/subscriptions`)
    .doc(channelUserId);
  await subscriptionRef.update({ status: "incomplete" });
}

async function handleCustomerSubscriptionDeleted(event) {
  let subscription = event.data.object;
  let { userId, channelUserId } = subscription.metadata;

  // delete subscription doc
  await db
    .collection(`subscriptions/${userId}/subscriptions`)
    .doc(channelUserId)
    .delete();

  // decrement subscriber count
  let channelUserRef = db.collection("users").doc(channelUserId);
  await channelUserRef.update({
    subscriberCount: admin.firestore.FieldValue.increment(-1),
  });
}
