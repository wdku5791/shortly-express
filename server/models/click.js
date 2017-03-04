var db = require('../db');

var addClick = function(linkId) {
  var queryString = 'INSERT INTO clicks SET ?';
  return db.queryAsync(queryString, { linkId: linkId }).return(linkId);
};

module.exports = {
  addClick: addClick
};
