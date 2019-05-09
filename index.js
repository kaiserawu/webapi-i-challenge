// implement your API here

const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      return res.json(users);
    }).catch(err => {
      return res.status(500).json({ error: "There was an error while saving the user to the database" });
    })
})

server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    }).catch(err => {
      return res.status(500).send({ error: "The user information could not be retrieved." });
    })
})

server.post('/api/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(newUser)
    .then(newId => {
      db.findById(newId.id)
        .then(userData => {
          return res.status(201).json(userData);
        }).catch(err => {
          return res.send(err);
        })
    }).catch(err => {
      return res.status(500).json({ error: "There was an error while saving the user to the database" });
    })
})

server.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user) {
        db.remove(userId)
          .then(() => {
            return res.json(user);
          }).catch(err => {
            return res.status(500).json({ error: "The user could not be removed" });
          })
      } else {
        return res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    }).catch(err => {
      return res.send(err);
    })
})

server.listen(9090, () => {
  console.log('Listening on port 9090');
})