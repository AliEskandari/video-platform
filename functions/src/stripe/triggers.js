const functions = require("firebase-functions");
const stripe = require("./stripe");

// ============================================================================
// Trigger functions
// ============================================================================

exports.stripeOnUserCreate = functions
  .region("us-west3")
  .firestore.document("users/{userId}")
  .onCreate(async (snap, context) => {
    const customer = await stripe.customers.create({
      email: snap.data().email,
      metadata: {
        userId: context.params.userId,
      },
    });

    await snap.ref.update({
      stripeCustomerId: customer.id,
    });
  });

exports.stripeOnUserDelete = functions
  .region("us-west3")
  .firestore.document("users/{userId}")
  .onDelete(async (snap, context) => {
    const stripeCustomerId = snap.data().stripeCustomerId;
    const stripeAccountId = snap.data().stripeAccountId;

    await stripe.customers.del(stripeCustomerId);
    await stripe.accounts.del(stripeAccountId);

    return true;
  });
