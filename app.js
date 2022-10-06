const express = require('express');
var AWS = require('aws-sdk');
var uuid = require('uuid');


const app = express();

const port = 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}...`);
});

