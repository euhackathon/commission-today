define([
  'jquery'
],
function ($) {
  'use strict';

  var defaultBaseURL = "/api/v1";

  function create(baseURL) {
    return new Client(baseURL || defaultBaseURL);
  }

  function Client(baseURL){
    var _instance = this;
    var _baseURL = baseURL;

    // The events the API Client broadcasts.
    var _events = {};

    // The data returned from the API.
    var response = {};

    // Make a HTTP GET request.
    // @param url [String] The path, relative to the API's base URL.
    // @param options [Object] An optional hash of settings.
    //   May include 'callback'—a callback function, and 'page'—the
    //   page to query.
    function get(url, options) {
      options = options || {};

      // TODO consolidate parameter parsing.
      var params = '';
      var delimiter;
      var urlAndParams = url;
      if (options.page) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'page=' + options.page;
        urlAndParams += params;
      }
      if (options.limit) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'limit=' + options.limit;
        urlAndParams += params;
      }
      if (options.order_by) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'order_by=' + options.order_by;
        urlAndParams += params;
      }
      if (options.date) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'date=' + options.date;
        urlAndParams += params;
      }
      if (options.date__lt) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'date__lt=' + options.date__lt;
        urlAndParams += params;
      }
      if (options.date__gt) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'date__gt=' + options.date__gt;
        urlAndParams += params;
      }
      if (options.member) {
         delimiter = '?';
        if (urlAndParams.indexOf('?') != -1)
          delimiter = '&';
        params = delimiter + 'member=' + options.member;
        urlAndParams += params;
      }
      
      delimiter = '?';
      if (urlAndParams.indexOf('?') != -1)
        delimiter = '&';
      urlAndParams += delimiter + 'format=json';

      _dispatchEvent('dataloading', {'path':url});
      $.getJSON(_baseURL + urlAndParams, function(data, status, xhr) {
        if (status === 'success')
          _dataLoaded(data, url, options.page, options.callback);
        // TODO: Add handling for different server responses:
        // 'notmodified', 'error', 'timeout', and 'parsererror'.
      });
    }

    function flush() {
      response = {};
      _instance.response = {};
    }
 
    // @param data [Object] The data payload of the response to a get request.
    // @param url [String] The URL passed to a get request for this response.
    // @param callback [Function] An optional callback function to execute when
    //   the request is complete.
    function _dataLoaded(data, url, page, callback) {
      // Build path on client and attach data to last node.
      _buildPathFrom(data, url);

      _dispatchEvent('dataloaded', {path:url, data:data, page:page});
      if (callback)
        callback.call(null, {path:url, data:data, page:page});
    }

    // @param data [Object] The data payload of the response to a get request.
    // @param url [String] A URL path, with a preceding slash.
    //   ex. /organizations/3881
    function _buildPathFrom(data, url) {
      // Strip parameters from url if present.
      if (url.indexOf('?') != -1)
          url = url.substring(0, url.indexOf('?'));

      // Break URL path into pieces so it can be used in an iteration loop.
      var tokens = url.split('/');

      // Iterate through path and attach structure to response if needed.
      var numTokens = tokens.length;
      var token;
      var count = 1;
      var thePath = response;
      var lastPath = thePath;

      token = tokens[0];
      if (!lastPath[token])
        lastPath[token] = {};
      if (count !== numTokens)
        lastPath = lastPath[token];
      while (count < numTokens) {
        token = tokens[count++];
        if (!lastPath[token])
          lastPath[token] = {};
        if (count === numTokens) break;
        lastPath = lastPath[token];
      }
      var lastNode = lastPath[token];

      // Loop through data and populate last node of path with data properties.
      for (var d in data) {
        if (data.hasOwnProperty(d))
          lastNode[d] = data[d];
      }

      // Refresh the response output.
      _instance.response = response;
    }

    // @param event [String] The event name to listen for.
    // Supports 'dataloading' and 'dataloaded'.
    // @param callback [Function] The function called when the event has fired.
    function addEventListener(name, callback) {
      if (_events.hasOwnProperty(name))
        _events[name].push(callback);
      else
        _events[name] = [callback];
    }

    // @param event [String] The event name to listen for.
    // Supports 'dataloading' and 'dataloaded'.
    // @param callback [Function] The function called when the event has fired.
    function removeEventListener(name, callback) {
      if (!_events.hasOwnProperty(name))
        return;

      var index = _events[name].indexOf(callback);
      if (index != -1)
        _events[name].splice(index, 1);
    }

    // @param name [String] The type of event to broadcast.
    // Supports 'dataloading' and 'dataloaded'.
    function _dispatchEvent(name, options) {
      if (!_events.hasOwnProperty(name)) return;
      options = options || {};

      var evts = _events[name], len = evts.length;
      for (var i = 0; i < len; i++) {
        evts[i].call(null, options);
      }
    }

    _instance.get = get;
    _instance.flush = flush;
    _instance.addEventListener = addEventListener;
    _instance.removeEventListener = removeEventListener;
    _instance.response = response;
    return _instance;
  }

  return {
    create:create
  }
});
