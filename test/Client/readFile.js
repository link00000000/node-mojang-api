const test = require("ava");
const path = require("path");

const Client = require("../../lib/Client");

test("Client/readFile", t => {
    let client = new Client(path.join(__dirname, "readFile.js.client.json"));
    try
    {
        client.readFile();
        t.fail();
    }
    catch(e)
    {
        t.pass();
    }
});
