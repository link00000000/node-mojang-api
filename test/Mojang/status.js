const { STATUS_SERVER } = require("../../lib/constants.json");

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Mojang = require("../../lib/Mojang");

test("Mojang/status", async t => {

    if(process.env.OFFLINE)
    {
        nock(STATUS_SERVER)
            .get("/check").reply((uri, req) => {
                return [
                    { 'minecraft.net': 'red' },
                    { 'session.minecraft.net': 'red' },
                    { 'account.mojang.com': 'red' },
                    { 'authserver.mojang.com': 'red' },
                    { 'sessionserver.mojang.com': 'red' },
                    { 'api.mojang.com': 'red' },
                    { 'textures.minecraft.net': 'red' },
                    { 'mojang.com': 'red' }
                ]
            });
    }

    let status = await Mojang.status();
    t.pass();

});
