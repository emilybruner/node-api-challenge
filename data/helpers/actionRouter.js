express = require('express');
const Action = require('./actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    Action.get()
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "List of actions could not be retrieved"})
    })
})

module.exports = router;