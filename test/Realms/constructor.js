const { AUTH_SERVER } = require("../../lib/constants.json");
require("dotenv").config();

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Auth = require("../../lib/Authentication");
const Realms = require("../../lib/Realms");

test("Realms/constructor", t => {

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

    let auth = new Auth(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "constructor.js.client.json"));
    let realms = new Realms(auth);
    t.pass();

});
