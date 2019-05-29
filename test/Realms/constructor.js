const test = require("ava");
const path = require("path");
require("dotenv").config();

const Auth = require("../../lib/Authentication");
const Realms = require("../../lib/Realms");

test("Realms/constructor", t => {
    let auth = new Auth(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "constructor.js.client.json"));
    let realms = new Realms(auth);
    t.pass();
});
