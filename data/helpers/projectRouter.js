const express = require('express');
const Project = require('../helpers/projectModel');

const router = express.Router();

// GET a list of all projects

router.get('/', (req, res) => {
    Project.get()
    .then(project => {
        res.status(200).json(project);
    })
    .catch(error => {
        console.log('error from GET request', error)
        res.status(500).json({ errorMessage: 'Retrieving project information failed'})
    })
})

// GET a project by ID

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})


// GET a list of project actions for a project with a specific id

router.get('/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id;
    Project.getProjectActions(id)
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "Could not retrieve project actions"})
    })
})

// POST - create a new project

router.post('/', validateProject, (req, res) => {
    const project = req.body;
    Project.insert(project)
    .then(newProject => {
        res.status(201).json(newProject)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "Unable to save project"})
    })
})

// PUT -- edit a project

router.put('/:id', validateProjectId, (req, res) => {
    const changes = req.body;
    const id = req.params.id;

    Project.update(id, changes)
    .then(change => {
        res.status(200).json(change)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "Unable to update project information"})
    })
})

// Delete a project

router.delete('/:id', validateProjectId, (req, res) => {
    Project.remove(req.params.id)
    .then(remove => {
        res.status(200).json({ message: 'project successfully deleted', remove})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "The posst could not be removed"})
    })
})

// custom middleware

function validateProjectId(req, res, next){
    const id = req.params.id;
    Project.get(id)
    .then(projectById => {
        if (projectById) {
            req.project = projectById;
            next();
        } else {
            res.status(404).json({error: 'The project with the specified id does not exist'})
        }
    })
}

function validateProject(req, res, next) {
    if (Object.keys(req.body).length > 0) {
        if (req.body.description && req.body.name){
            next();
        } else {
            res.status(400).json({errorMessage: "Please provide a name and description for the project"})
        }
    } else {
        res.status(500).json({errorMessage: "Could not save project to the database"})
    }
}



module.exports = router;