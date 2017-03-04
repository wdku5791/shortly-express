var mysql = require('mysql');
var createTables = require('./config');
var Promise = require('bluebird');
var database = 'shortly';

var connection = mysql.createConnection({
  user: 'root',
  password: ''
});

var db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync().then(function() {
  console.log('Connected to ' + database + 'database as ID ' + db.threadId);
  return db.queryAsync('CREATE DATABASE IF NOT EXISTS ' + database);
}).then(function() {
  return db.queryAsync('USE ' + database);
}).then(function() {
  return createTables(db);
});

module.exports = db;