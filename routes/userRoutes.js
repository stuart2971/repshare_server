const express = require("express");
const router = express.Router();

const { addUser, getUser, changeCurrency } = require("../utils/userUtils");

router.get("/getUser/:auth0ID", async (req, res) => {
    const user = await getUser(req.params.auth0ID);

    if (user) res.json(user);
    else {
        let newUser = await addUser(req.params.auth0ID);
        res.json(newUser);
    }
});

router.get("/changeCurrency/:auth0ID/:currency", async (req, res) => {
    let data = changeCurrency(req.params.auth0ID, req.params.currency);
    res.json(data);
});

module.exports = router;
