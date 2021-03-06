// Generated by CoffeeScript 1.7.1
(function() {
  define(function(require) {
    var exports, querystring, tough, url;
    require('/static/node_components');
    RegExp.escape = function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    url = node_url;
    tough = node_tough;
    querystring = node_querystring;
    exports = {
      cookie_parse: function(cookie_string) {
        var cookie, each, index, key, value, _i, _len, _ref;
        cookie = {};
        _ref = cookie_string != null ? cookie_string.split(';') : void 0;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          each = _ref[_i];
          index = each.indexOf('=');
          index = index < 0 ? each.length : index;
          key = each.slice(0, +index + 1 || 9e9);
          value = each.slice(index + 1);
          cookie[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        return cookie;
      },
      cookie_unparse: function(cookie) {
        var key, value;
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (value = _i = 0, _len = cookie.length; _i < _len; value = ++_i) {
            key = cookie[value];
            _results.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
          }
          return _results;
        })()).join(';');
      },
      url_parse: node_url.parse,
      url_unparse: node_url.format,
      querystring_parse: node_querystring.parse,
      querystring_unparse: node_querystring.stringify,
      querystring_unparse_with_variables: function(obj) {
        var key, m, query, re, replace_list, value;
        query = node_querystring.stringify(obj);
        replace_list = {};
        for (key in obj) {
          value = obj[key];
          re = /{{\s*([\w]+)[^}]*?\s*}}/g;
          while (m = re.exec(key)) {
            replace_list[encodeURIComponent(m[0])] = m[0].slice(0, -2) + '|urlencode}}';
          }
          re = /{{\s*([\w]+)[^}]*?\s*}}/g;
          while (m = re.exec(value)) {
            replace_list[encodeURIComponent(m[0])] = m[0].slice(0, -2) + '|urlencode}}';
          }
        }
        console.log(replace_list);
        for (key in replace_list) {
          value = replace_list[key];
          query = query.replace(new RegExp(RegExp.escape(key), 'g'), value);
        }
        return query;
      },
      querystring_parse_with_variables: function(query) {
        var key, m, re, replace_list, value, _query;
        replace_list = {};
        re = /{{\s*([\w]+)[^}]*?\s*\|urlencode}}/g;
        _query = decodeURIComponent(query);
        while (m = re.exec(_query)) {
          replace_list[encodeURIComponent(m[0])] = m[0].slice(0, -12) + '}}';
        }
        for (key in replace_list) {
          value = replace_list[key];
          query = query.replace(new RegExp(RegExp.escape(key), 'g'), value);
        }
        return exports.querystring_parse(query);
      },
      CookieJar: node_tough.CookieJar,
      Cookie: node_tough.Cookie,
      dict2list: function(dict) {
        var k, v, _results;
        _results = [];
        for (k in dict) {
          v = dict[k];
          _results.push({
            name: k,
            value: v
          });
        }
        return _results;
      },
      list2dict: function(list) {
        var dict, each, _i, _len;
        dict = {};
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          each = list[_i];
          dict[each.name] = each.value;
        }
        return dict;
      },
      get_public_suffix: node_tough.getPublicSuffix,
      get_domain: function(url) {
        return exports.get_public_suffix(exports.url_parse(url).hostname);
      },
      debounce: function(func, wait, immediate) {
        var later, timeout, timestamp;
        timestamp = 0;
        timeout = 0;
        later = function() {
          var args, context, last, result;
          last = (new Date().getTime()) - timestamp;
          if ((0 < last && last < wait)) {
            return timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              if (!timeout) {
                return context = args = null;
              }
            }
          }
        };
        return function() {
          var args, callNow, context, result;
          context = this;
          args = arguments;
          timestamp = new Date().getTime();
          callNow = immediate && !timeout;
          if (!timeout) {
            timeout = setTimeout(later, wait);
          }
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }
          return result;
        };
      },
      storage: {
        set: function(key, value) {
          var error;
          if (window.localStorage == null) {
            return false;
          }
          try {
            return window.localStorage.setItem(key, angular.toJson(value));
          } catch (_error) {
            error = _error;
            return null;
          }
        },
        get: function(key) {
          var error;
          if (window.localStorage == null) {
            return null;
          }
          try {
            return angular.fromJson(window.localStorage.getItem(key));
          } catch (_error) {
            error = _error;
            return null;
          }
        },
        del: function(key) {
          var error;
          if (window.localStorage == null) {
            return false;
          }
          try {
            return window.localStorage.removeItem(key);
          } catch (_error) {
            error = _error;
            return null;
          }
        }
      },
      tpl2har: function(tpl) {
        var en, x;
        return {
          log: {
            creator: {
              name: 'binux',
              version: 'qiandao'
            },
            entries: (function() {
              var _i, _len, _ref, _ref1, _ref2, _results;
              _results = [];
              for (_i = 0, _len = tpl.length; _i < _len; _i++) {
                en = tpl[_i];
                _results.push({
                  checked: true,
                  startedDateTime: (new Date()).toISOString(),
                  time: 1,
                  request: {
                    method: en.request.method,
                    url: en.request.url,
                    headers: (function() {
                      var _j, _len1, _ref, _results1;
                      _ref = en.request.headers || [];
                      _results1 = [];
                      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                        x = _ref[_j];
                        _results1.push({
                          name: x.name,
                          value: x.value,
                          checked: true
                        });
                      }
                      return _results1;
                    })(),
                    queryString: [],
                    cookies: (function() {
                      var _j, _len1, _ref, _results1;
                      _ref = en.request.cookies || [];
                      _results1 = [];
                      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                        x = _ref[_j];
                        _results1.push({
                          name: x.name,
                          value: x.value,
                          checked: true
                        });
                      }
                      return _results1;
                    })(),
                    headersSize: -1,
                    bodySize: en.request.data ? en.request.data.length : 0,
                    postData: {
                      mimeType: en.request.mimeType,
                      text: en.request.data
                    }
                  },
                  response: {},
                  cache: {},
                  timings: {},
                  connections: "0",
                  pageref: "page_0",
                  success_asserts: (_ref = en.rule) != null ? _ref.success_asserts : void 0,
                  failed_asserts: (_ref1 = en.rule) != null ? _ref1.failed_asserts : void 0,
                  extract_variables: (_ref2 = en.rule) != null ? _ref2.extract_variables : void 0
                });
              }
              return _results;
            })(),
            pages: [],
            version: '1.2'
          }
        };
      }
    };
    return exports;
  });

}).call(this);
