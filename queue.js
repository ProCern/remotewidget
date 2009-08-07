var RequestQueue = function()
{
  this.requests = [];
  this.results = {};
  this.whenAllCompleted = function() { };
};

RequestQueue.prototype.addRequest = function(method, href) {
  this.requests.push( {
      "method":   method,
      "href":     href,
      completed:  false
  });
};

RequestQueue.prototype.dispatchAll = function() {
  var self = this;
  $.each(self.requests, function( i, request) {
    request.method( request.href, function (r) {
      return function(datapoints) {
        request.completed = true;
        self.results[request.href] = datapoints;
        self.checkAndComplete();
      };
    }(request));
  });
};

RequestQueue.prototype.checkAndComplete = function() {
  if (this.allRequestsComplete()) {
    this.whenAllCompleted(this.results);
  }
};

RequestQueue.prototype.allRequestsComplete = function() {
  var i = 0;
  while ( r = this.requests[i++] ) {
    if (r.completed === false) {
      return false;
    }
  }
  return true;
};
