const express = require('express');
var AWS = require('aws-sdk');
var uuid = require('uuid');


var mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', {root:__dirname});
});

app.post('/', (req, res) => {
    const { name, email, message } = req.body;
    const { authorization } = req.headers;

    const nname = String(name);
    const nemail = String(email);
    const nmessage = String(message);

    const sql = ['INSERT INTO ContactForm VALUES (\'', nname,'\', \'', nemail,'\', \'', nmessage, '\')'].join('');
    console.log(sql);


    var connection = mysql.createConnection({
        host     : process.env.RDS_HOSTNAME,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        port     : process.env.RDS_PORT,
        database : "contact_form"
      });
      
      connection.connect(function(err) {
        if (err) {
          console.error('Database connection failed: ' + err.stack);
          return;
        }
      
        console.log('Connected to database.');
        
        connection.query(sql, function (err, result, fields) {
          if (err) throw err;
          console.log(result);
        });

      });

});

app.post('/login', (req, res) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  // res.send(`Username: ${username} Password: ${password}`);

  var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : "login_db"
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');

    var loginsql = `SELECT Name, Password FROM users WHERE Name = \'${username}\' AND Password = \'${password}\'`
    
    connection.query(loginsql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);

      let rlen = result.length;

      if (rlen == 0) {
        res.send(`Login Denied`);
      }
      else {
        res.send('Login Accepted');
      }

    });

  });

});

app.listen(port, () => {
    console.log(`Now listening on port ${port}...`);
});

