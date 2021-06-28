const express = require("express");
const router = express.Router();

const { addUser, getUser } = require("../utils/userUtils");

router.get("/getUser/:auth0ID", async (req, res) => {
    const user = await getUser(req.params.auth0ID);
    if (user) res.json({ createdUser: false });
    else {
        await addUser(req.params.auth0ID);
        res.json({ createdUser: true });
    }
});

module.exports = router;
