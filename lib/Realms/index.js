const { REALMS_SERVER, CLIENT_TOKEN, VERSION } = require("../constants.json");
const request = require("request");

/**
 * a Minecraft world hosted on Minecraft Realms
 * @typedef {Object} RealmsWorld
 * @property {number} id - The ID of the world
 * @property {string} owner - The owner of the world
 * @property {string} ownerUUID - The unique ID of the owner, note: UUID does not have hyphens
 * @property {string} name - The name of the world
 * @property {string} motd - The MOTD of the server, does not support color
 * @property {string} state - The status of the server, can be one of the following: ADMIN_LOCK, CLOSED, OPEN, UNITIALIZED
 * @property {number} daysLeft - How many days are left of subscription. Always '0' if not owner and returns '-1' if expired
 * @property {boolean} expired - Whether the subscription has expired
 * @property {boolean} expiredTrial - Whether the trial subscription has expired
 * @property {string} worldType - Type of the world, can be one of the following: NORMAL, MINIGAME, ADVENTUREMAP, EXPERIENCE, INSPIRATION
 * @property {string} minigameName - The name of the minigame that is currently active, null if not in a minigame
 * @property {number} minigameId - The unique ID of the minigame, null if not in minigame
 * @property {string} minigameImage - base64 of the current minigame image in the format PNG, null if not in minigame
 * @property {number} activeSlot - Current server world (1-4)
 */

/**
 * a Minecraft Realms world backup
 * @typedef {Object} RealmsWorldBackup
 * @property {string} backupId - The ID of the world backup
 * @property {number} lastModifiedDate - The timestamp the backup was created
 * @property {number} size - The size of the backup
 * @property {RealmsWorldBackupMetadata} metadata - Additional data about the backup
 */

/**
 * a container for additional Minecraft Realms backup data
 * @typedef {Object} RealmsWorldBackupMetadata
 * @property {number} game_difficulty - The difficulty set for the world, 0-3. The difficlties are as follows: 0 - Peaceful, 1 - Easy, 2 - Normal, 3 - Hard
 * @property {string} name - The name of the world
 * @property {string} gameServerVersion - The version of Minecraft when the backup was created
 * @property {string} enabledPacks
 * @property {string} description
 * @property {number} game_mode - The default gamemode of the world
 * @property {string} world_type - The type of world generation used
 */

/**
 * a container for a Minecraft Realms subscription
 * @typedef {Object} RealmsSubscription
 * @property {number} startDate - Timestamp of when the subscription was started
 * @property {number} daysLeft - Number of days left before the subscription renews, -1 if the subscription is inactive
 * @property {string} subscriptionType - The type of subscription, can be one of the following: NORMAL, RECURRING
 */

/** Class representing a client connected to Minecraft Realms */
class Realms
{
    /**
     * Creates a Realms client
     * @param {Authentication} auth - a valid authenticated authentication client
     */
    constructor(auth)
    {
        this.auth = auth;
    }

    /**
     * Sets and returns list of worlds that the authenticated user has access to on Minecraft Realms
     * @return {RealmsWorld[]} - Array of RealmsWorld objects
     */
    async getWorlds()
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }

            request({
                uri: "/worlds",
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /worlds resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                this.worlds = JSON.parse(body).servers;
                resolve(this.worlds);
            });
        });
    }

    /**
     * Returns the current IP of the realm
     * @param {RealmsWorld} world - A Minecraft Realms world object
     * @return {string} Server IP
     */
    async getIP(world)
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }

            request({
                uri: "/worlds/v1/" + world.id + "/join/pc",
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /worlds/v1/" + world.id + "/join/pc resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(JSON.parse(body).address);
            });
        });
    }

    /**
     * Returns true if the server has a pending update
     * @param {RealmsWorld} world - A Minecraft Realms world object
     * @return {boolean} server has update
     */
    async hasPendingUpdate(world)
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }

            request({
                uri: "/worlds/v1/" + world.id + "/join/pc",
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /worlds/v1/" + world.id + "/join/pc resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(JSON.parse(body).pendingUpdate);
            });
        });
    }

    /**
     * Returns the list of backups for the world
     * @param {RealmsWorld} world - A Minecraft Realms world object
     * @return {RealmsWorldBackup[]} - An array of Minecraft Realms backups
     */
    async getBackups(world)
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }

            request({
                uri: "/worlds/" + world.id + "/backups",
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /worlds/" + world.id + "/backups resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(JSON.parse(body).backups);
            });
        });
    }

    /**
     * Returns the URL to the latest world backup
     * @param {RealmsWorld} world - A Minecraft Realms world object
     * @return {string} URL to Minecraft Realms backup
     */
    async getDownload(world)
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }

            request({
                uri: "/worlds/" + world.id + "/slot/" + world.activeSlot + "/download",
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /worlds/" + world.id + "/slot/" + world.activeSlot + "/download resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(JSON.parse(body).downloadLink);
            });
        });
    }

    /**
     * Gets a list of operators for a Minecraft Realm
     * @param {RealmsWorld} world - A Minecraft Realms world object
     * @return {string[]} A list of operators names
     */
    async getOPs(world)
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }
            request({
                uri: "/ops/" + world.id,
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /ops/" + world.id + " resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(JSON.parse(body));
            });
        });
    }

    /**
     * Gets information about the Minecraft Realms subscription
     * @param {RealmsWorld} world - A Minecraft Realms world object
     * @return {RealmsSubscription} Information about the Minecraft Realms subscription
     */
    async getSubscription(world)
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }
            request({
                uri: "/subscriptions/" + world.id,
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /subscriptions/" + world.id + " resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(JSON.parse(body));
            });
        });
    }

    /**
     * Gets the number of pending Minecraft Realms invites the currently authenticated user has
     * @return {number} number of pending Minecraft Realms invites
     */
    async getPendingInvites()
    {
        return new Promise(async (resolve, reject) => {
            if(!await this.auth.validate())
            {
                this.auth.refresh();
            }
            request({
                uri: "/invites/count/pending",
                baseUrl: REALMS_SERVER,
                method: "GET",
                headers: {
                    Cookie: `sid=token:${this.auth.accessToken}:${this.auth.id};user=${this.auth.name};version=${VERSION}`
                }
            }, (err, res, body) => {
                if(err)
                {
                    reject(err);
                }
                if(res.statusCode != 200)
                {
                    reject(new Error("request to /invites/count/pending resulting in error " + res.statusCode + "\n" + JSON.stringify(body)));
                }
                resolve(parseInt(body));
            });
        });
    }
}

module.exports = Realms;
