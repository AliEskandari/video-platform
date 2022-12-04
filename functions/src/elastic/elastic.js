const AppSearchClient = require("@elastic/app-search-node");
const functions = require("firebase-functions");

const apiKey = functions.config().elastic.key;
const baseUrlFn = () =>
  "https://domum-gym.ent.us-central1.gcp.cloud.es.io/api/as/v1/";

var engineName = "";

if (process.env.NODE_ENV === "production") {
  engineName = "domum-gym-engine";
} else {
  engineName = "domum-gym-local-engine";
}

const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

module.exports = { elastic: client, engineName };
