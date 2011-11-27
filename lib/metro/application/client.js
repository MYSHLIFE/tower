
  Metro.Application.Client = (function() {

    function Client(middleware) {
      var _i, _len, _middleware;
      if (middleware == null) middleware = [];
      this.stack = [];
      for (_i = 0, _len = middleware.length; _i < _len; _i++) {
        _middleware = middleware[_i];
        this.use(_middleware);
      }
      this.History = global.History;
    }

    Client.prototype.initialize = function() {
      this.extractAgent();
      this.use(Metro.Middleware.Router);
      return this;
    };

    Client.prototype.extractAgent = function() {
      return Metro.agent = new Metro.Net.Agent({
        os: navigator,
        ip: navigator,
        browser: navigator,
        language: navigator
      });
    };

    Client.prototype.use = function(route, handle) {
      this.route = "/";
      if ("string" !== typeof route) {
        handle = route;
        route = "/";
      }
      if ("/" === route[route.length - 1]) {
        route = route.substr(0, route.length - 1);
      }
      this.stack.push({
        route: route,
        handle: handle
      });
      return this;
    };

    Client.prototype.listen = function() {
      var self;
      self = this;
      if (this.listening) return;
      this.listening = true;
      if (this.History && this.History.enabled) {
        return this.History.Adapter.bind(global, "statechange", function() {
          var parsedUrl, request, response, state;
          state = History.getState();
          parsedUrl = new Metro.Route.Url(state.url);
          request = new Request({
            url: state.url,
            parsedUrl: parsedUrl,
            params: _.extend({
              title: state.title
            }, state.data || {})
          });
          response = new Response({
            url: state.url,
            parsedUrl: parsedUrl
          });
          return self.handle(request, response);
        });
      } else {
        return _console.warn("History not enabled");
      }
    };

    Client.prototype.run = function() {
      return this.listen();
    };

    Client.prototype.handle = function(request, response, out) {
      var env, index, next, removed, stack, writeHead;
      env = Metro.env;
      next = function(err) {
        var arity, c, layer, msg, path, removed;
        layer = void 0;
        path = void 0;
        c = void 0;
        request.url = removed + request.url;
        request.originalUrl = request.originalUrl || request.url;
        removed = "";
        layer = stack[index++];
        if (!layer || response.headerSent) {
          if (out) return out(err);
          if (err) {
            msg = ("production" === env ? "Internal Server Error" : err.stack || err.toString());
            if ("test" !== env) console.error(err.stack || err.toString());
            if (response.headerSent) return request.socket.destroy();
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end(msg);
          } else {
            response.statusCode = 404;
            response.setHeader("Content-Type", "text/plain");
            response.end("Cannot " + request.method + " " + request.url);
          }
          return;
        }
        try {
          path = request.pathname;
          if (undefined === path) path = "/";
          if (0 !== path.indexOf(layer.route)) return next(err);
          c = path[layer.route.length];
          if (c && "/" !== c && "." !== c) return next(err);
          removed = layer.route;
          request.url = request.url.substr(removed.length);
          if ("/" !== request.url[0]) request.url = "/" + request.url;
          arity = layer.handle.length;
          if (err) {
            if (arity === 4) {
              return layer.handle(err, request, response, next);
            } else {
              return next(err);
            }
          } else if (arity < 4) {
            return layer.handle(request, response, next);
          } else {
            return next();
          }
        } catch (e) {
          return next(e);
        }
      };
      writeHead = response.writeHead;
      stack = this.stack;
      removed = "";
      index = 0;
      return next();
    };

    return Client;

  })();
