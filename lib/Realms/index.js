const { AUTH_SERVER, CLIENT_TOKEN } = require("../constants.json");
const request = require("request");

/** Class representing a client connected to Minecraft Realms */
class Realm
{
    /**
     * Creates a Realms client
     * @param {Authentication} - a valid authentication client
     */
    constructor(auth)
    {
        this.auth = auth;
        this.auth.authenticate();
    }
}

module.exports = Realm;
