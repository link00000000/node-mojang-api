const test = require("ava");
const path = require("path");

const Client = require("../../lib/Client");

test("Client/fileExists", t => {
    let client = new Client(path.join(__dirname, "fileExists.js.client.json"));
    if(client.fileExists() == true)
    {
        t.fail();
    }
    t.pass();
});
