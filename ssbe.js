function findservice(service_name,callback) {
  $.jsonp({
    url:servicedesc, 
    success:function(services) {
      found_service = $.grep(services.items, function(service, i) {
        return service.service_type === service_name;
      })[0];
      callback(found_service);
    }
  });
}

function findresource(resource_name,service, callback) {
  $.jsonp({
    url:found_service.href, 
    success:function(resources) {
      resource = $.grep(resources.items, function(resource,i) {
        return resource.name === resource_name;
      })[0];
      callback(resource);
    }
  });
}

function getresource(url,callback){
  $.jsonp({
    url:url,
    success:function(res) {
      callback(res);
    }
  });
}

function graphlist(s,obs_list) {
  var rq = new RequestQueue();
  $.each(obs_list,function(i,value) {
    rq.addRequest(getresource, value);
  });
  rq.whenAllCompleted = function(results) {
    var data = [];
    data = $.map(obs_list, function(obs_href) {
      return $.map(results[obs_href].items,function(item) {
        var stamp = new Date();
        stamp.setISO8601(item.timestamp);
        return([stamp.getTime(),item.value]);
      });
    });
    graphdata(s,data);
  };
  rq.dispatchAll();
}

function graphdata(s,data) {
    console.log(data);
    $.plot($(s),[data],{xaxis:{mode:"time"}});
}

function graphflot(sel,obs_href) {
  getresource(obs_href,function(observations) {
    var d = [];
    $.each(observations.items,function(j,item) {
      var stamp = new Date();
      stamp.setISO8601(item.timestamp);
      d.push([stamp.getTime(),item.value]);
      });
    var sorted = d.sort();
    $.plot($(sel),[sorted],{xaxis:{mode:"time"}});
  });
}

