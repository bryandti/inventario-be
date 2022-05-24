const MongoClient = require('mongodb').MongoClient;
let cors = require('cors')
let bodyParser = require('body-parser')
const express = require('express');
const app = express();
const port = 3000;

let jsonParser = bodyParser.json();

let db;
let collection;

app.use(cors());



// import packages
const https = require('https');
const fs = require('fs');

// serve the API with signed certificate on 443 (SSL/HTTPS) port
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/munibe.oligarchy.io/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/munibe.oligarchy.io/fullchain.pem'),
}, app);

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});



MongoClient.connect('mongodb://localhost/invetario', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    db = client.db('inventario')
    collection= db.collection('equipo')
})

app.get('/equipo', (req, res) => {
    db.collection('equipo').find().toArray()
        .then(results => {
            res.json(results);
        }).catch(error => console.error(error));
})

app.get('/ultimoequipo', (req, res) => {
    db.collection('equipo').find().toArray()
        .then(results => {
            res.json({coorelativo: results.length + 1});
        }).catch(error => console.error(error));
})

app.post('/equipo', jsonParser, (req, res) => {
    console.log(req.body);
    db.collection('equipo').insertOne(req.body)
        .then(result => {
            res.json('Success');
        })
        .catch(error => console.error(error))
})

app.get('/equipo/:coorelativo', (req, res) => {
    console.log('Obteniendo:', req.params.coorelativo)
    db.collection('equipo')
        .findOne(
            { "coorelativo": Number(req.params.coorelativo) },
            (error, result) => {
                if(error) {
                    console.log(error);
                    res.json({error});
                }
                res.json(result);
            }
        );
})

app.delete('/equipo/:coorelativo', (req, res) => {
    console.log('Borrando:', req.params.coorelativo)
    db.collection('equipo').deleteMany(
        { "coorelativo": Number(req.params.coorelativo) }
    )
        .then(result => {
            res.json('Deleted')
        })
        .catch(error => console.error(error))
})

