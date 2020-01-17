express = require('express');
const Action = require('./actionModel');

const router = express.Router();

// GET list of all actions

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

// POST - create a new action

router.post('/', validateAction, (req, res) => {
    const action = req.body;

    Action.insert(action)
    .then(action => {
        res.status(201).json(action)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "A project with that ID does not exist- Unable to save action"})
    })
})

// PUT - edit an action 

router.put('/:id', validateActionId, (req, res) => {
    const id = req.params.id;
    const action = req.body;

    Action.update(id, action)
    .then(update => {
        res.status(200).json(update)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "There was an error while saving the action information"})
    })
})

// Delete an action

router.delete('/:id', validateActionId, (req, res) => {
    const id = req.params.id;

    Action.remove(id)
    .then(remove => {
        res.status(200).json({message: 'action was successfully deleted', remove})
    })
    .catch(error => {
        res.status(500).json({ error: "Error encountered while deleting action"})
    })
})

// Middleware

function validateAction(req, res, next) {
    if (Object.keys(req.body).length > 0){
        if(req.body.project_id && req.body.description && req.body.notes && req.body.description.length < 128){
            next();
        } else {
            res.status(400).json({message: "Missing one of the required fields: name, description, notes. Note: description length cannot exceed 128 characters"})
        } 
    } else {
        res.status(400).json({message: "missing action information"})
    }
}

// function validateAction(req, res, next) {
//     if (Object.keys(req.body).length > 0){
//         if (req.body.project_id && req.body.description && req.body.notes && req.body.description.length < 128)
//     }
// }

function validateActionId(req, res, next) {
    const id = req.params.id;

    Action.get(id)
        .then(action => {
            if (action) {
                req.action = action
                next();
            } else {
                res.status(400).json({message: "invalid id"})
            }
        })
        .catch(error => {
            res.status(500).json({error: "Could not retrieve information for that action"})
        })
}


module.exports = router;