var db = require('../db');
var util = require('../lib/utility');

var addToDatabase = function(session, callback) {
  var inputString = 'INSERT INTO sessions (username, user_id) VALUES (?, ?)';
  db.query(inputString, [session.username, session.user_id], function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);      
    }
  });
};

var checkHash = function (hash, callback) {
  db.query('select * from sessions where hash = ?', [hash], function (err, results) {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });

};

module.exports = {
  addToDatabase: addToDatabase,
  checkHash: checkHash,
};
