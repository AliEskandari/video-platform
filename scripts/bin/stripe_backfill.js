require("dotenv").config();

const stripe = require("../lib/stripe");
const firebase = require("../lib/firebase");
const db = firebase.firestore();

async function createStripeAccounts() {
  async function onCreate(snap) {
    console.log(snap.id);
    const account = await stripe.accounts.create({
      type: "express",
      email: snap.data().email,
      metadata: {
        userId: snap.id,
      },
    });
    const customer = await stripe.customers.create({
      email: snap.data().email,
      metadata: {
        userId: snap.id,
      },
    });

    await snap.ref.update({
      stripeAccountId: account.id,
      stripeCustomerId: customer.id,
    });
  }

  const users = await db.collection("users").get();
  const promises = users.docs.map((userSnap) => {
    return onCreate(userSnap);
  });
  const results = await Promise.all(promises);
  console.log("done");
}

async function deleteStripeAccounts(snap) {
  const stripeCustomerId = snap.data().stripeCustomerId;
  const stripeAccountId = snap.data().stripeAccountId;

  await stripe.customers.del(stripeCustomerId);
  await stripe.accounts.del(stripeAccountId);
}

async function asyncFunction() {
  const accounts = await stripe.accounts.list();
  accounts.data.map((account) => {
    stripe.accounts.del(account.id);
  });
}

createStripeAccounts();
// asyncFunction();
