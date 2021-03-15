const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Thing = require('./models/Thing')

mongoose.connect('mongodb+srv://matthias_api_03_21:99DdNvDY6JPj8ga@cluster0.2fna0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); // dont' forget the next function to continue middlewares of your Express Applications
  });

app.use(bodyParser.json());

//POST Routes always before GET route
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id; // delete the id generated by the front-end app
  const thing = new Thing({
    ...req.body //With spread operator (...), we copy all elements in the body of request (send by front-end)
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //Promise
    .catch(error => res.status(400).json({ error }));
  });

  // GET Routes
  app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  });
  
app.get('/api/stuff', (req, res, next) => {
  Thing.find()
  .then(things => res.status(200).json(things))
  .catch(error => res.status(400).json({ error }));
  });

module.exports = app;