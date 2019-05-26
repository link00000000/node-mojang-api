import test from "ava";

test("authentication", t => {
    const Authentication = require('../lib/Authentication');
    let client = new Authentication("email", "password");
    console.log(client);
    t.pass();
});
