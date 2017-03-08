var Sessions = require('../models/session');
var util = require('../lib/utility');
var crypto = require('crypto');


var createSession = function(req, res, next) {

  // console.log('user agent ', res.get('User-Agent'));
  // check to see if header has cookie
  // if no cookie create a new session.
    // redirect to login page
  // console.log('--------req-----------', req.body);
  var session;
  //Check for cookies
  console.log(Object.keys(req.cookies).length);
  if (Object.keys(req.cookies).length > 0) {
    // if there is cookies check for our cookie
    if (req.cookies.hasOwnProperty('shortlyid')) {
      // if it has our cookie check that the hash matches a session
      Sessions.checkHash(req.cookies.shortlyid, function (err, results) {
        // checked database for cookie's hash value in sessions, accessible in results as t/f
        if (results) {
        // if results true then hash matched and session added to response
          console.log('reached the true results');
          
          session = {
            hash: req.cookies.shortlyid,
            user_id: 'user id',
            username: '',
          };
          req.session = session;

        } else {
        // if results false then delete the cookies from 
        // the response headers and reissue cookie to header.
          
          console.log('reached the false results', req.cookies.shortlyid);
          session = {
            hash: req.cookies.shortlyid,
            user_id: 'user id',
            username: '',
          };
          req.session = session;          
          delete res.cookies.shortlyid;
        }
        next();
      });

    }
  } else {
    //create hash session and cookies
    console.log('reached here the no cookies section');
    var sessionHash = util.sessionGenerator(8);
    var hash = crypto.createHash('sha1');
    hash.update(sessionHash);
    sessionHash = hash.digest('hex').slice(0, 32);

    session = {
      hash: sessionHash,
      user_id: 'user id',
      username: '',
    };
    var shortlyid = {
      value: session.hash
    };
    // Sessions.addToDatabase(session, )
    res.cookies['shortlyid'] = shortlyid;
    req.session = session;
    next();
  }
  // console.log('--------res-----------', res.cookies.value);
};

module.exports = createSession;
