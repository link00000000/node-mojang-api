const test = require("ava");
const path = require("path");
require("dotenv").config();

const Authentication = require("../../lib/Authentication");

test("Authentication/validate", async t => {
    let client = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "validate.js.client.json"));
    await client.authenticate();
    if(await client.validate() == false)
    {
        t.fail();
    }
    client.client.setAccessToken = "INVALID_ACCESS_TOKEN";
    if(await client.validate() == true)
    {
        t.fail();
    }
    t.pass();
});
