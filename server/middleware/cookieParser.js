var parseCookies = function(req, res, next) {
  
  // console.log(req.headers.hasOwnProperty('cookie'));
    // console.log(cookies);
  if (req.headers.hasOwnProperty('cookie')) {
    var cookies = (req.headers.cookie).split('; ');
    cookies.forEach(function(item) {
      var tuple = item.split('=');
      req.cookies[tuple[0]] = tuple[1];
    });
  }
};

module.exports = parseCookies;