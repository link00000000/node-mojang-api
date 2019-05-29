require("dotenv").config();

const test = require("ava");
const path = require("path");

const Authentication = require("../../lib/Authentication");

test("Authentication/constructor", t => {

    let auth = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "constructor.js.client.json"));
    t.pass();

});
