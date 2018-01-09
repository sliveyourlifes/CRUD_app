const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const port = 3000;
const url = 'mongodb://AlexXBS:Alexxb123@ds035553.mlab.com:35553/test-db';


// middleware
// for parse data from <form>
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

//connect to MDdatabase
var db;

MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(port, () => {
        console.log('listening on 3000')
    })
});

// Create - get data from mlab

app.get('/', (req, res) => {
    db.collection('mycollection').find().toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        res.render('index.ejs', {quotes: result})
    })
})

//Post - Create - add fields to data
app.post('/quotes', (req, res) => {
    db.collection('mycollection').save(req.body, (err, result) => {
        if (err) return console.log(err);

        console.log('saved to database');
        // res.send(req.body.name + " " + req.body.quote);
        res.redirect('/');
    })
});

// Put - update data 

app.put('/quotes', (req, res) => {
    db.collection('mycollection')
        .findOneAndUpdate({name: 'Alex'}, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        })
});

// Delete - from Db

app.delete('/quotes', (req, res) => {
    db.collection('mycollection').findOneAndDelete({name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err)
            res.send({message: 'A darth vadar quote got deleted'})
        })
})


