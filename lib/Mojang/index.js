const { STATUS_SERVER, API_SERVER, SESSION_SERVER } = require("../constants.json");
const request = require("request");

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
                throw err;
            }
            if(res.statusCode != 200)
            {
                throw new Error("request to /check resulting in error " + res.statusCode + "\n" + JSON.stringify(body));
            }
            resolve(JSON.parse(body));
        });
    });
}
