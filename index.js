
'use strict';

// Express - web application framework for building web applications and APIs
const express = require('express');
const app = express();

// Skeleton for configuration (it is not really needed...but it is the way togo)
var config = require('./config');

const {Datastore} = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = null; // here your "Table name"

// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

// Cloud Storage
const storage = new Storage();


// Smart API
app.get('/', (req, res) => {
    console.log('Wow! I received a request.');
    
    res.send(`Hello Folks...I am working at ${process.env.PORT || 8080}`);
});



// What is in my store? ....Let's see
app.get('/store', (req, res) => {
    console.log('ci sono :');
    storage
        .getBuckets()
        .then((results) => {
            const buckets = results[0];
            res.json({
                buckets: buckets,
                result: "OK"
            });
            console.log('Buckets:');
            buckets.forEach((bucket) => {
                console.log(bucket.name);
            });

        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.json({
                error: err,
                result: "KO"
            });
        });
});

// Datastore - Query - if don't ask for an entitity it gives what it will find
app.get('/q', (req, res) => {

    const myquery = (kind) ? ds.createQuery([kind]) : ds.createQuery();
    /*.limit(limit)
     .order('title')
     .start(token);*/

    ds.runQuery(myquery, (err, entities, nextQuery) => {
        if (err) {
            console.log(err);
            return;
        }
        const hasMore =
            (nextQuery.moreResults !== Datastore.NO_MORE_RESULTS)
                ? nextQuery.endCursor
                : false;
        // use your nice callback
        res.json({
            items: entities,
            nextPageToken: hasMore
        });
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Hi! I am listening on port', port);
});