const fs = require("fs");

/** Class representing the client */
class Client
{
    /**
     * Creates a client
     * @param {string} [path] - A path to the JSON file where the client will be stored
     */
    constructor(path)
    {
        this.path = path;
    }

    /**
     * Sets the access token
     * @param {string} accessToken - Access token
     */
    set setAccessToken(accessToken)
    {
        this.accessToken = accessToken;
        this.writeFile();
    }

    /**
     * Sets the name
     * @param {string} name - Name
     */
    set setName(name)
    {
        this.name = name;
        this.writeFile();
    }

    /**
     * Sets the id
     * @param {string} id - ID
     */
    set setId(id)
    {
        this.id = id;
        this.writeFile();
    }

    /**
     * Checks if the path of the client json file exists
     * @return {boolean}
     */
    fileExists()
    {
        return fs.existsSync(this.path);
    }

    /**
     * Reads the client json file and sets the values stored to the current client
     */
    readFile()
    {
        if(!this.fileExists())
        {
            throw new Error("Trying to read from a file that doesn't exist - " + this.path);
        }

        try
        {
            let jsonClient = JSON.parse(fs.readFileSync(this.path));
            this.accessToken = jsonClient.accessToken;
            this.name = jsonClient.name;
            this.id = jsonClient.id;
        }
        catch (e)
        {
            throw new Error("There was an error parsing the client json file - " + e);
        }
    }

    /**
     * Writes the current client to the client json file
     */
    writeFile()
    {
        try
        {
            fs.writeFileSync(this.path, JSON.stringify({
                accessToken: this.accessToken,
                name: this.name,
                id: this.id
            }));
        }
        catch (e)
        {
            throw new Error("There was an error writing the client json file - " + e);
        }
    }
}

module.exports = Client;
