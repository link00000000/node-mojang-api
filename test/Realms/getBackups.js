const { AUTH_SERVER, REALMS_SERVER } = require("../../lib/constants.json");
require("dotenv").config();

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Auth = require("../../lib/Authentication");
const Realms = require("../../lib/Realms");

test("Realms/getWorlds", async t => {

    if(process.env.OFFLINE)
    {
        nock(AUTH_SERVER)
            .persist()
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
        nock(REALMS_SERVER)
            .get(/\/worlds\/\d*\/backups/).reply((uri, req) => {
                console.log(req);
                return {
                    "backups": [
                        {
                            backupId: 'xxxxxxxxxxxxxxxxxxxxxxx',
                            lastModifiedDate: 0,
                            size: 0,
                            metadata: {
                                game_difficulty: '0',
                                name: 'world',
                                game_server_version: null,
                                enabled_packs: null,
                                description: 'A Minecraft server!',
                                game_mode: '0',
                                world_type: 'NORMAL'
                            }
                        }
                    ]
                }
            });
    }

    let auth = new Auth(process.env.EMAIL, process.env.PASSWORD, path.join(__dirname, "getBackups.js.client.json"));
    await auth.authenticate();
    let realms = new Realms(auth);
    let worlds = await realms.getWorlds();
    let backups = await realms.getBackups(worlds[0]);
    t.pass();

});
