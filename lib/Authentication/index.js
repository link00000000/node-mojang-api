const { AUTH_SERVER, CLIENT_TOKEN } = require("../constants.json");
const Client = require("../Client");
const path = require("path");
const request = require("request");

/** Class representing the authentication of a client with Mojang's
  * authentication server */
class Authentication
{
    /**
     * Creates an authentication client
     * @param {string} email - email of Mojang account
     * @param {string} password - password of Mojang account
     * @param {string} [client_path=<CURRENT_WORKING_DIRECTORY>] - path to the file that will store the client
     */
    constructor(email, password, client_path)
    {
        this.email = email;
        this.password = password;
        this.client = new Client(client_path || path.join(process.cwd(), "client.json"));
    }

    /**
     * Access token of client object
     * @return {string} - access token
     */
    get accessToken()
    {
        return this.client.accessToken;
    }

    /**
     * Name of client object
     * @return {string} - client name
     */
    get name()
    {
        return this.client.name;
    }

    /**
     * ID of client object
     * @return {string} - client id
     */
    get id()
    {
        return this.client.id;
    }

    set accessToken(accessToken)
    {
        this.client.setAccessToken = accessToken;
    }

    set name(name)
    {
        this.client.setName = name;
    }

    set id(id)
    {
        this.client.setId = id;
    }

    /**
     * Performs authentication with Mojang server
     * @param {string} [game="Minecraft"] - Game to authenticate with, either "Minecraft" or "Scrolls"
     * @return {string} - access token
     */
     async authenticate(game = "Minecraft")
     {
         if(game != "Minecraft" && game != "Scrolls")
         {
             reject(new Error("Unsupported game supplied. Supported games are \"Minecraft\" and \"Scrolls\""));
         }

         return new Promise((resolve, reject) => {
             request({
                 uri: "/authenticate",
                 baseUrl: AUTH_SERVER,
                 method: "POST",
                 json: true,
                 body: {
                     "agent": {
                         "name": game,
                         "version": 1
                     },
                     "username": this.email,
                     "password": this.password,
                     "clientToken": CLIENT_TOKEN,
                     "requestUser" : false
                 }
             }, (err, res, body) => {
                 if(err)
                 {
                     reject(err);
                 }
                 if(res.statusCode == 400 || res.statusCode == 403)
                 {
                     reject(new Error("Request to /authenticate resulting in an http error: 400 - Invalid login credentials supplied"));
                 }
                 if(res.statusCode != 200)
                 {
                     reject(new Error("Request to /authenticate resulting in an http error: " + res.statusCode + "\n" + JSON.stringify(body)));
                 }
                 if(body.clientToken != CLIENT_TOKEN)
                 {
                     reject(new Error("Client token recieved does not match client token provided: Request invalidated"));
                 }

                 try
                 {
                     this.accessToken = body.accessToken;
                     this.name = body.selectedProfile.name;
                     this.id = body.selectedProfile.id;

                     resolve(body.accessToken);
                 }
                 catch (e)
                 {
                     reject(new Error("There was an error parsing response from /authenticate - " + e));
                 }
             });
         });
     }

     /**
      * Performs refresh of the access token with Mojang server
      * @return {string} - access token
      */
     async refresh()
     {
         return new Promise((resolve, reject) => {
             request({
                 uri: "/refresh",
                 baseUrl: AUTH_SERVER,
                 method: "POST",
                 json: true,
                 body: {
                     "accessToken": this.accessToken,
                     "clientToken": CLIENT_TOKEN,
                 }
             }, (err, res, body) => {
                 if(err)
                 {
                     reject(err);
                 }
                 if(res.statusCode != 200)
                 {
                     reject(new Error("Request to /refresh resulting in an http error: " + res.statusCode + "\n" + JSON.stringify(body)));
                 }
                 if(body.clientToken != CLIENT_TOKEN)
                 {
                     reject(new Error("Client token recieved does not match client token provided: Request invalidated"));
                 }

                 try
                 {
                     this.accessToken = body.accessToken;
                     resolve(body.accessToken);
                 }
                 catch (e)
                 {
                     reject(new Error("There was an error parsing response from /refresh - " + e));
                 }
             });
         });
     }

     /**
      * Performs validate of the access token with Mojang server
      * @return {boolean}
      */
     async validate()
     {
         return new Promise((resolve, reject) => {
             request({
                 uri: "/validate",
                 baseUrl: AUTH_SERVER,
                 method: "POST",
                 json: true,
                 body: {
                     "accessToken": this.accessToken
                 }
             }, (err, res, body) => {
                 if(err)
                 {
                     reject(err);
                 }
                 if(res.statusCode != 204 && res.statusCode != 403)
                 {
                     reject(new Error("Request to /validate resulting in an http error: " + res.statusCode + "\n" + JSON.stringify(body)));
                 }
                 if(res.statusCode == 204)
                 {
                     resolve(true);
                 }
                 if(res.statusCode == 403)
                 {
                     resolve(false);
                 }
             });
         });
     }
}

module.exports = Authentication;
