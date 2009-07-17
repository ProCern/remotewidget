function findservice(service_name,callback) {
  $.jsonp({
    url:servicedesc, 
    success:function(services) {
      found_service = $.grep(services.items, function(service, i) {
        return service.service_type === service_name;
      })[0];
      callback(found_service);
    }
  })
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

function getresources(urls,callback) {
  $.each
}

function getobs(obs_list) {
  data = new Array();
  $.each(obs_list,function(i,value) {
      getresource(value,function(obs_res) {
        var set = new Array();
        $.each(obs_res.items, function(j,item) {
          var stamp = new Date();
          stamp.setISO8601(this.timestamp);
          set.push([stamp.getTime(),item.value]);
          });
        data.push(set.sort());
        });
      });
}

function graphdata(s) {
    $.plot($(s),data,{xaxis:{mode:"time"}});
}

function graphflot(sel,obs_href) {
  getresource(obs_href,function(observations) {
    var d=new Array();
    $.each(observations.items,function(j,item) {
      var stamp = new Date();
      stamp.setISO8601(item.timestamp);
      d.push([stamp.getTime(),item.value])
      });
    var sorted = d.sort();
    $.plot($(sel),[sorted],{xaxis:{mode:"time"}});
  });
}

