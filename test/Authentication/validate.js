const { AUTH_SERVER } = require("../../lib/constants.json");
require("dotenv").config();

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Authentication = require("../../lib/Authentication");

test("Authentication/validate", async t => {

    if(process.env.OFFLINE)
    {
        nock(AUTH_SERVER)
            .post("/authenticate").reply((uri, req) => {
                return {
                    accessToken: "ACCESS_TOKEN",
                    clientToken: req.clientToken,
                    selectedProfile: {
                        id: "ID",
                        name: "NAME"
                    }
                }
            })
            .post("/validate").reply((uri, req) => {
                if(req.accessToken == "ACCESS_TOKEN")
                {
                    return [204];
                }
                return [403];
            });
    }

    let auth = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "validate.js.client.json"));
    await auth.authenticate();
    if(await auth.validate() == false)
    {
        t.fail();
    }
    t.pass();

});
