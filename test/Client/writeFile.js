const test = require("ava");
const path = require("path");

const Client = require("../../lib/Client");

test("Client/writeFile", t => {
    let client = new Client(path.join(__dirname, "writeFile.client.json"));
    client.setAccessToken = "ACCESS_TOKEN";
    client.setName = "NAME";
    client.setId = "ID";
    client.writeFile();
    t.pass();
});
