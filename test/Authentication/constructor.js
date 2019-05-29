const test = require("ava");
const path = require("path");
require("dotenv").config();

const Authentication = require("../../lib/Authentication");

test("Authentication/constructor", t => {
    let client = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "constructor.js.client.json"));
    t.pass();
});
