const test = require("ava");
const path = require("path");

const Client = require("../../lib/Client");

test("Client/constructor", t => {
    let client = new Client(path.join(__dirname, "constructor.js.client.json"));
    t.pass();
});
