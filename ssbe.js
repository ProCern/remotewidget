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
