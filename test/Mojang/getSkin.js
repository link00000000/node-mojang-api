const { SESSION_SERVER } = require("../../lib/constants.json");

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Mojang = require("../../lib/Mojang");

test("Mojang/getSkin", async t => {

    if(process.env.OFFLINE)
    {
        nock(SESSION_SERVER)
            .get(/\/session\/minecraft\/profile\/[A-Z, a-z, 0-9]*/).reply((uri, req) => {
                return {
                    id: "aaaabbbbccccddddeeee11112222333344445555",
                    name: "username",
                    properties: [
                        {
                            name: "textures",
                            value: "eyJwcm9maWxlSWQiOiJhYWFhYmJiYmNjY2NkZGRkZWVlZTExMTEyMjIyMzMzMzQ0NDQ1NTU1IiwicHJvZmlsZU5hbWUiOiJ1c2VybmFtZSIsInRleHR1cmVzIjp7IkNBUEUiOnsidXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL2NhcGUvdXNlcm5hbWUifSwiU0tJTiI6eyJ1cmwiOiJodHRwOi8vZXhhbXBsZS5jb20vc2tpbi91c2VybmFtZSIsIm1vZGVsIjoic2xpbSJ9fSwidGltZXN0YW1wIjowfQ=="
                        }
                    ]
                }
            });
    }

    let accountTextures = await Mojang.getSkin("069a79f444e94726a5befca90e38aaf5");
    t.pass();
});
