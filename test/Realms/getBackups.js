const { AUTH_SERVER, REALMS_SERVER } = require("../../lib/constants.json");
require("dotenv").config();

const test = require("ava");
const nock = require("nock");
const path = require("path");

const Auth = require("../../lib/Authentication");
const Realms = require("../../lib/Realms");

test("Realms/getBackups", async t => {

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
            .get("/worlds").reply((uri, req) => {
                return {
                    "servers":[{
                        "id":1,
                        "remoteSubscriptionId":"aaaa0000bbbb1111cccc2222dddd3333",
                        "owner":"j_selby",
                        "ownerUUID":"3333dddd2222cccc1111bbbb0000aaaa",
                        "name":"A Test Server",
                        "motd":"This is a testing server!",
                        "state":"OPEN",
                        "daysLeft":30,
                        "expired":false,
                        "expiredTrial":false,
                        "worldType":"NORMAL",
                        "players":["Notch"],
                        "maxPlayers":10,
                        "minigameName":null,
                        "minigameId":null,
                        "minigameImage":null,
                        "activeSlot":1,
                        "slots":null,
                        "member":false
                    }]
                }
            })
            .get(/\/worlds\/\d*\/backups/).reply((uri, req) => {
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
