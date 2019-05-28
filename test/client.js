const test = require("ava");
const path = require("path");

const Client = require("../lib/Client");

test("Client/constructor", t => {
    let client = new Client(path.join(__dirname, "client.json"));
    t.pass();
});

test("Client/fileExists", t => {
    let clientExists = new Client(path.join(__dirname, "client.json"));
    let clientNotExists = new Client(path.join(__dirname, "client_not_exist.json"));
    if(clientExists.fileExists() == false)
    {
        t.fail();
    }
    if(clientNotExists.fileExists() == true)
    {
        t.fail();
    }
    t.pass();
});

test("Client/readFile", t => {
    let client = new Client(path.join(__dirname, "client.json"));
    client.readFile();
    t.pass();
});

test("Client/writeFile", t => {
    let client = new Client(path.join(__dirname, "client.json"));
    client.setAccessToken = "ACCESS_TOKEN";
    client.setName = "NAME";
    client.setId = "ID";
    client.writeFile();
    t.pass();
});
