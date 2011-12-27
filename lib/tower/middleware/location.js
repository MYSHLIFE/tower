
Tower.Middleware.Location = function(request, response, next) {
  request.location || (request.location = new Tower.HTTP.Url(request.url.match(/^http/) ? request.url : "http://" + request.headers.host + request.url));
  return next();
};

module.exports = Tower.Middleware.Location;
