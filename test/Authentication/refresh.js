const test = require("ava");
const path = require("path");
require("dotenv").config();

const Authentication = require("../../lib/Authentication");

test("Authentication/refresh", async t => {
    let client = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "refresh.js.client.json"));
    await client.authenticate();
    await client.refresh();
    t.pass();
});
