// implement your API here
require('dotenv').config();

const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  return res.send('<h1>Hello World</h1>');
})

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

server.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  const updateData = req.body;

  if (!updateData.name || !updateData.bio) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.findById(userId)
    .then(user => {
      if (user) {
        db.update(userId, updateData)
          .then(() => {
            db.findById(userId)
              .then(user => {
                return res.status(200).json(user);
              }).catch(err => {
                return res.send(err);
              })
          }).catch(err => {
            return res.status(500).json({ error: "The user information could not be modified." });
          })
      } else {
        return res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
})

const port = process.env.PORT || 4040;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
})