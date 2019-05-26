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
    }

}

module.exports = Authentication;
