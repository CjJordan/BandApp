// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
var PORT = 3000;

// Middleware
// =============================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

// DATA
// =============================================================
var users = [
  {
    name: "Invisible Man",
    username: "invisibleMan",
    password: "333aaa",
    accountBalance: 3000
  },
  {
    name: "Mary Mae",
    username: "mary",
    password: "444",
    accountBalance: 1000
  },
  {
    name: "Ivan Blimense",
    username: "ivan",
    password: "444",
    accountBalance: 1000
  },
  {
    name: "Tasha Long",
    username: "tasha",
    password: "444",
    accountBalance: 1000
  },
  {
    name: "hacker",
    username: "hacker",
    password: "000",
    accountBalance: 0
  }
];

// HTML Routes
// =============================================================
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/register", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/register.html"));
});

app.get("/transfer", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/transfer.html"));
});

// API Routes
// =============================================================
app.get("/users", function(req, res) {
  const names = users.map(e => e.name);
  res.json(names);
});

app.post("/account", function(req, res) {
  console.log("account",req.body);
  const owner = users.find(e=>e.username === req.body.username);
  console.log(owner.accountBalance);
  res.json(owner.accountBalance);
});

app.post("/login", function(req, res) {
  !!users.find(e => e.username === req.body.username && e.password === req.body.password)?
    res.sendFile(path.join(__dirname, "/public/transfer.html")):
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/register", function(req, res) {
  users.push({...req.body, accountBalance: 100})
  res.sendFile(path.join(__dirname, "/public/transfer.html"))
});

app.post("/xfer", function(req, res) {
  console.log(req.body);
  const recipient = users.find(e=>e.name === req.body.name);
  recipient.accountBalance += parseFloat(req.body.amount);
  const owner = users.find(e=>e.username === req.body.owner);
  owner.accountBalance -= parseFloat(req.body.amount);
  res.json(owner.accountBalance);
});





// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
