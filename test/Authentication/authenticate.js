const { AUTH_SERVER } = require("../../lib/constants.json");
require("dotenv").config();

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Authentication = require("../../lib/Authentication");

test("Authentication/authenticate", async t => {

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
            });
    }

    let auth = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "authenticate.js.client.json"));
    let res = await auth.authenticate();
    t.pass();

});
