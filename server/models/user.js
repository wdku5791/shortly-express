var db = require('../db');
var utils = require('../lib/utility');

// Write you user database model methods here
var addUser = function (user, callback) {
  var queryString = 'INSERT INTO users SET ?';
  utils.passwordHash(user);
  db.query(queryString, user, function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      // console.log('added user, user.js');
      callback(null, results);
    }
  });
};

var checkForUser = function (user, callback) {
  // var queryString = `select * from users where username = "${user.username}"`;
  // var queryString = 'select * from users where username = "' + user.username + '"';
  var queryString = 'SELECT * FROM users where username = ?';  
  db.query(queryString, [user.username], function(err, results) {

    // console.log('------------', user.password, '-------------------');
    utils.passwordHash(user);
    // console.log('------------', user.password, '-------------------');
    // var tempPassword = JSON.stringify(results[0].password);
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0 && user.password === results[0].password) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
};

module.exports = {
  addUser: addUser,
  checkForUser: checkForUser
};
