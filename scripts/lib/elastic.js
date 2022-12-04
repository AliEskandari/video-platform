const AppSearchClient = require("@elastic/app-search-node");

const apiKey = "private-pbsmdbqof8nbtqwrh7fu44hr";
const baseUrlFn = () =>
  "https://domum-gym.ent.us-central1.gcp.cloud.es.io/api/as/v1/";
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

module.exports = client;
