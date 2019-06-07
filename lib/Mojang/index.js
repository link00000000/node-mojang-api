const { STATUS_SERVER, API_SERVER, SESSION_SERVER } = require("../constants.json");
const request = require("request");
const atob = require("atob")

/**
 * a module that contains miscellaneous endpoint wrappers for Mojang APIs
 * @module Mojang
 */

/**
 * a container for Minecraft name history instances
 * @typedef {object} NameHistoryInstance
 * @property {string} name - The username of the account
 * @property {number} [changedToAt] - The (java) timestamp the username was changed to the associated username. This value is absent for the original username
 */

/**
 * a container for Minecraft account textures
 * @typedef {object} TexturesContainer
 * @property {SkinContainer} skin - Data about a minecraft skin
 * @property {CapeContainer} cape - Data about a minecraft cape
 */

/**
 * a container for Minecraft skin data
 * @typedef {object} SkinContainer
 * @property {string} url - The url to the skin texture
 * @property {string} model - The model type of the skin, can be one of the following: normal, slim
 */

/**
 * a container for Minecraft cape data
 * @typedef {object} CapeContainer
 * @property {string} url - The url to the cape texture
 */

/**
 * Checks the status of all mojang servers
 * @return {object[]} an array of servers and statuses in the form { <server_name>: <server_status> }. Server status can be on of the following: green - no issues, yellow - some issues, red - server unavailable
 */
exports.status = async () => {
    return new Promise((resolve, reject) => {
        request({
            uri: "/check",
            baseUrl: STATUS_SERVER,
            method: "GET"
        }, (err, res, body) => {
            if(err)
            {
                reject(err);
            }
            if(res.statusCode != 200)
            {
                reject(new Error("request to /check resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
            }
            resolve(JSON.parse(body));
        });
    });
}

/**
 * Gets the UUID of the user of a specified username
 * @param {string} username - The username of the Minecraft account
 * @param {number} [timestamp=<current_time>] - The timestamp at which to check the username
 * @return {string} The UUID of the user with the username at the timestamp provided
 */
exports.getUUID = async (username, timestamp) => {
    return new Promise((resolve, reject) => {
        let uri = "/users/profiles/minecraft/" + username;
        if(timestamp)
        {
            uri += "?at=" + timestamp;
        }

        request({
            uri: uri,
            baseUrl: API_SERVER,
            method: "GET"
        }, (err, res, body) => {
            if(err)
            {
                reject(err);
            }
            if(res.statusCode != 200)
            {
                reject(new Error("request to " + uri + " resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
            }
            resolve(JSON.parse(body).id);
        });
    });
}

/**
 * Gets the history of names used by a user of a specified UUID
 * @param {string} uuid - The unhyphenated UUID of the Minecraft account
 * @return {NameHistoryInstance[]} An array containing the past names of a user
 */
exports.getNameHistory = async (uuid) => {
    return new Promise((resolve, reject) => {
        request({
            uri: "/user/profiles/" + uuid + "/names",
            baseUrl: API_SERVER,
            method: "GET"
        }, (err, res, body) => {
            if(err)
            {
                reject(err);
            }
            if(res.statusCode != 200)
            {
                reject(new Error("request to /user/profiles/" + uuid + "/names resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
            }
            resolve(JSON.parse(body));
        });
    });
}

/**
 * Gets the URL to the cape and skin textures of the specified user
 * @param {string} uuid - The unhypenated UUID of the Minecraft account
 * @return {TexturesContainer} The textures associated with the specified account
 */
exports.getSkin = async (uuid) => {
    return new Promise((resolve, reject) => {
        request({
            uri: "/session/minecraft/profile/" + uuid,
            baseUrl: SESSION_SERVER,
            method: "GET"
        }, (err, res, body) => {
            if(err)
            {
                reject(err);
            }
            if(res.statusCode != 200)
            {
                reject(new Error("request to /session/minecraft/profile/" + uuid + " resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
            }
            let encodedTextures = JSON.parse(body).properties[0].value;
            let textures = JSON.parse(atob(encodedTextures)).textures;
            resolve({
                skin: {
                    url: textures.SKIN.url,
                    model: "normal" || textures.SKIN.metadata.model
                },
                cape: {
                    url: textures.CAPE ? textures.CAPE.url : null
                }
            });
        });
    });
}
