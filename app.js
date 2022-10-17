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

function getContacts() {
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

    var sql = `SELECT * FROM ContactForm`;
    
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });

  //Table Building Test
  var body = document.getElementsByTagName('body')[0];
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < 3; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < result.length; j++) {
      if (i == 2 && j == 1) {
        break
      } else {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode('\u0020'))
        i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
        tr.appendChild(td)
      }
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl)

  return body;
}

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
        res.send(`getContacts()`);
      }

    });

  });

});

app.listen(port, () => {
    console.log(`Now listening on port ${port}...`);
});

