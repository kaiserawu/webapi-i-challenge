// implement your API here

const express = require('express');

const db = require('./data/db.js');

const server = express();

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    }).catch(err => {
      res.status(500).json({ error: "There was an error while saving the user to the database" });
    })
})

server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    }).catch(err => {
      res.status(500).send({ error: "The user information could not be retrieved." });
    })
})

server.listen(9090, () => {
  console.log('Listening on port 9090');
})