const { AUTH_SERVER } = require("../../lib/constants.json");
require("dotenv").config();

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Authentication = require("../../lib/Authentication");

test("Authentication/refresh", async t => {

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
            .post("/refresh").reply((uri, req) => {
                return {
                    accessToken: "REFRESHED_ACCESS_TOKEN",
                    clientToken: req.clientToken,
                    selectedProfile: {
                        id: "ID",
                        name: "NAME"
                    }
                }
            });
    }

    let auth = new Authentication(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "refresh.js.client.json"));
    await auth.authenticate();
    await auth.refresh();
    t.pass();

});
