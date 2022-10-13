const express = require('express');
var AWS = require('aws-sdk');
var uuid = require('uuid');


var mysql = require('mysql');



const app = express();

const port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.post('/', (req, res) => {
    const { name, email, message } = req.body;
    const { authorization } = req.headers;

    const nname = String(name);
    const nemail = String(email);
    const nmessage = String(message);

    const sql = ['INSERT INTO contact VALUES (\'', nname,'\', \'', nemail,'\', \'', nmessage, '\')'].join('');
    console.log(sql);


var con = mysql.createConnection({
    host: "contact-db-instance-1.cx47xgllgyqu.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Sparky224",
    port: 3306,
    database: "contact_schema"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
  });

});

app.listen(port, () => {
    console.log(`Now listening on port ${port}...`);
});

