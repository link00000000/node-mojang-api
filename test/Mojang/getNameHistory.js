const { API_SERVER } = require("../../lib/constants.json");

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Mojang = require("../../lib/Mojang");

test("Mojang/getNameHistory", async t => {

    if(process.env.OFFLINE)
    {
        nock(API_SERVER)
            .get(/\/user\/profiles\/[A-Z, a-z, 0-9]*\/names/).reply((uri, req) => {
                return [
                    {
                        name: "usernameOne",
                    }
                ]
            });
    }

    let nameHistory = await Mojang.getNameHistory("069a79f444e94726a5befca90e38aaf5");
    t.pass();
});
