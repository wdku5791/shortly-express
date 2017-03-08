var Promise = require('bluebird');

module.exports = function(db) {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }

  // Create links table
  return db.queryAsync('CREATE TABLE IF NOT EXISTS links (\
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    url VARCHAR(255),\
    baseUrl VARCHAR(255),\
    code VARCHAR(5),\
    title VARCHAR(255),\
    visits INT NOT NULL DEFAULT 0,\
    timestamp TIMESTAMP\
    );')
  .then(function() {
    // Create clicks table
    return db.queryAsync('CREATE TABLE IF NOT EXISTS clicks (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      linkId INT,\
      timestamp TIMESTAMP\
      );');
  }).then(function() {
    // Create users table
    return db.queryAsync('CREATE TABLE IF NOT EXISTS users (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      username VARCHAR(25),\
      password VARCHAR(25),\
      timestamp TIMESTAMP,\
      unique (username) \
      );');
  }).then(function() {
    // Create sessions table
    return db.queryAsync('CREATE TABLE IF NOT EXISTS sessions (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      hash VARCHAR(40),\
      user_id INT,\
      username VARCHAR(25),\
      timestamp TIMESTAMP,\
      unique (hash)\
      );');
    // needs a foreign key reference for user_id to users.id
  })
  /************************************************************/
  /*          Add additional schema queries here              */
  /************************************************************/

  .error(function(err) {
    console.log(err);
  });
};
