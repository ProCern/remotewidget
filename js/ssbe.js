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
  var results=[];
  var requests = 0;
  console.log(obs_list);

  $.each(obs_list, function(_,req) {
      console.log("getting "+req.url);
    $.jsonp({
      url:req.url,
      complete: function(xo,txt) {
        console.log(txt,xo);
      },
      success:function(data) {
        console.log("got " + req.url);
        results.push({label:req.label,data:$.map(data.items,function(item) {
            var stamp = new Date();
            stamp.setISO8601(item.timestamp);
            return [[stamp.getTime(),item.value]];
          })
        });
        requests+=1;

        if (requests == obs_list.length) {
          console.log(results);
          $.plot($(s),results,{xaxis:{mode:"time"}});
        }
      }
    });
  });
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

