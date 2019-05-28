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
     */
    constructor(email, password)
    {
        this.email = email;
        this.password = password;
        this.client = new Client(path.join(process.cwd(), "client.json"));
    }

    /**
     * Performs authentication with Mojang server
     * @param {string} [game="Minecraft"] - Game to authenticate with, either "Minecraft" or "Scrolls"
     * @return {string} access token
     */
     async authenticate(game = "Minecraft")
     {
         if(game != "Minecraft" && game != "Scrolls")
         {
             throw new Error("Unsupported game supplied. Supported games are \"Minecraft\" and \"Scrolls\"");
         }

         return new Promise((resolve) => {
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
                     throw err;
                 }
                 if(res.statusCode == 400 || res.statusCode == 403)
                 {
                     throw new Error("Request to /authenticate resulting in an http error: 400 - Invalid login credentials supplied");
                 }
                 if(res.statusCode != 200)
                 {
                     throw new Error("Request to /authenticate resulting in an http error: " + res.statusCode + "\n" + JSON.stringify(body));
                 }
                 if(body.clientToken != CLIENT_TOKEN)
                 {
                     throw new Error("Client token recieved does not match client token provided: Request invalidated");
                 }

                 try
                 {
                     this.client.accessToken = body.accessToken;
                     this.client.name = body.selectedProfile.name;
                     this.client.id = body.selectedProfile.id;

                     resolve(body.accessToken);
                 }
                 catch (e)
                 {
                     throw new Error("There was an error parsing response from /authenticate - " + e);
                 }
             });
         });
     }

     /**
      * Performs refresh of the access token with Mojang server
      * @return {string}
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
                     "accessToken": this.client.accessToken,
                     "clientToken": CLIENT_TOKEN,
                 }
             }, (err, res, body) => {
                 if(err)
                 {
                     throw err;
                 }
                 if(res.statusCode != 200)
                 {
                     throw new Error("Request to /refresh resulting in an http error: " + res.statusCode + "\n" + JSON.stringify(body));
                 }
                 if(body.clientToken != CLIENT_TOKEN)
                 {
                     throw new Error("Client token recieved does not match client token provided: Request invalidated");
                 }

                 try
                 {
                     this.client.accessToken = body.accessToken;
                     resolve(body.accessToken);
                 }
                 catch (e)
                 {
                     throw new Error("There was an error parsing response from /refresh - " + e)
                 }
             });
         });
     }
}

module.exports = Authentication;
