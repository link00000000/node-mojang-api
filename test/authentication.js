const test = require("ava");
require("dotenv").config();

const Authentication = require("../lib/Authentication");

test("Authentication/constructor", t => {
    let client = new Authentication(process.env.EMAIL, process.env.PASSWORD);
    t.pass();
});

test("Authentication/authenticate", async t => {
    let client = new Authentication(process.env.EMAIL, process.env.PASSWORD);
    let res = await client.authenticate();
    t.pass();
});
