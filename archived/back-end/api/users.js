const express = require("express")
const app = express();
const router = express.Router();

router.route("/")
.get((req, res) => {
    res.status(200).send("Success!")
})

module.exports = router;