
  Coach.Middleware.Router = function(request, response, callback) {
    Coach.Middleware.Router.find(request, response, function(controller) {
      if (controller) {
        response.writeHead(200, controller.headers);
        response.write(controller.body);
        response.end();
        return controller.clear();
      } else {
        return self.error(request, response);
      }
    });
    return response;
  };

  Coach.Support.Object.extend(Coach.Middleware.Router, {
    find: function(request, response, callback) {
      var controller, route, routes, _i, _len;
      routes = Coach.Route.all();
      this.processHost(request, response);
      this.processAgent(request, response);
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        controller = this.processRoute(route, request, response);
        if (controller) break;
      }
      if (controller) {
        controller.call(request, response, function() {
          return callback(controller);
        });
      } else {
        callback(null);
      }
      return controller;
    },
    processHost: function(request, response) {
      return request.location || (request.location = new Coach.Net.Url(request.url));
    },
    processAgent: function(request, response) {
      if (request.headers) {
        return request.userAgent || (request.userAgent = request.headers["user-agent"]);
      }
    },
    processRoute: function(route, request, response) {
      var capture, controller, i, keys, match, method, params, _len;
      match = route.match(request);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = route.keys;
      params = Coach.Support.Object.extend({}, route.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len = match.length; i < _len; i++) {
        capture = match[i];
        params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
      }
      controller = route.controller;
      if (controller) params.action = controller.action;
      request.params = params;
      if (controller) {
        controller = new (Coach.constant(Coach.namespaced(route.controller.className)));
      }
      return controller;
    },
    error: function(request, response) {
      if (response) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        return response.end("No path matches " + request.url);
      }
    }
  });

  module.exports = Coach.Middleware.Router;
