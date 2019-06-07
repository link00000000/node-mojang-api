const { API_SERVER } = require("../../lib/constants.json");

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Mojang = require("../../lib/Mojang");

test("Mojang/getUUID", async t => {

    if(process.env.OFFLINE)
    {
        nock(API_SERVER)
            .get(/\/users\/profiles\/minecraft\/[A-Z, a-z, 0-9]*/).reply((uri, req) => {
                return {
                    id: "aaaabbbbccccddddeeee11112222333344445555",
                    name: "username"
                }
            });
    }

    let uuid = await Mojang.getUUID("Notch");
    t.pass();
});
