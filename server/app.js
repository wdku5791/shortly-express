var express = require('express');
var path = require('path');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');

var Users = require('./models/user');
var Links = require('./models/link');
var Sessions = require('./models/session');
var Click = require('./models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from ../public directory
app.use(express.static(path.join(__dirname, '../public')));

// Parse header cookies

// Parse session

app.get('/', 
function(req, res) {
  res.render('login');
});

app.get('/create', 
function(req, res) {
  res.render('index');
});

app.get('/links', 
function(req, res, next) {
  Links.getAll()
  .then(function(results) {
    var links = results[0];
    res.status(200).send(links);
  })
  .error(function(error) {
    next({ status: 500, error: error });
  });
});

app.post('/links', 
function(req, res, next) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    // send back a 404 if link is not valid
    return next({ status: 404 });
  }

  return Links.getOne({ type: 'url', data: uri })
  .then(function(results) {
    if (results.length) {
      var existingLink = results[0];
      throw existingLink;
    }
    return util.getUrlTitle(uri);
  })
  .then(function(title) {
    return Links.addOne({
      url: uri,
      title: title,
      baseUrl: req.headers.origin
    });
  })
  .then(function() {
    return Links.getOne({ type: 'url', data: uri });
  })
  .then(function(results) {
    var link = results[0];
    res.status(200).send(link);
  })
  .error(function(error) {
    next({ status: 500, error: error });
  })
  .catch(function(link) {
    res.status(200).send(link);
  });
});
/************************************************************/
// Write your authentication routes here
/************************************************************/
app.post('/signup', function (req, res, next) {

  Users.addUser(req.body, function (err, results) {
    if (err) {
      console.log(err);
      res.redirect('/signup');
    } else {
      res.status(201);
      res.redirect('/');
    }

  });
});

app.post('/login', function (req, res, next) {
  Users.checkForUser(req.body, function (err, results) {
    
    if (err) {
      console.log(err);
    } else {
      res.status(201);
      if (results) {
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    }
  });


  // Users.checkForUser(req.body, function(err, results) {
  //   // console.log('--------resykts--------', results);
  //   if (err) {
  //     console.log(err);
  //   } else {
  //       // console.log('-------REACHED-------------');
  //     res.status(201);
  //     if (results.length > 0) {
  //       res.redirect('/');
  //     } else {
  //       res.redirect('/login');
  //     }
  //   }
  //   res.redirect('/');
  // });
});



/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res, next) {
  var code = req.params[0];
  var link;
  return Links.getOne({ type: 'code', data: code })
  .then(function(results) {
    link = results[0];

    if (!link) {
      throw new Error('Link does not exist');
    }
    return Click.addClick(link.id);
  })
  .then(function() {
    return Links.incrementVisit(link);
  })
  .then(function() {
    res.redirect(link.url);
  })
  .error(function(error) {
    next({ status: 500, error: error });
  })
  .catch(function() {
    res.redirect('/');
  });
});

app.use(function(err, req, res, next) {
  if (!err.error) {
    return res.sendStatus(err.status);
  }
  res.status(err.status).send(err.error);
});

module.exports = app;
