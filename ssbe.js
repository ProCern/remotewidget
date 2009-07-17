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

function graphflot(sel,obs_href) {
  getresource(obs_href,function(observations) {
    var d=new Array();
    $.each(observations.items,function(j,item) {
      var stamp = new Date();
      stamp.setISO8601(item.timestamp);
      d.push([stamp.getTime(),item.value])
      });
    d.sort(function(a,b){a[0]-b[0];});
    console.log(d);
    $.plot($(sel),[d],{xaxis:{mode:"time"}});
  });
}

function graphobsarray(chronoscope,id,graph_list) {
  var data = [];
  $.each(graph_list, function(obs_href) {
    data.push({});
    var i=data.length-1;
    getresource(obs_href,function(observations) {
      data[i]["range"] = [];
      data[i]["domain"] = [];
      data[i]["axis"] = "Axis";
      data[i]["label"] = "Label";
      data[i]["id"] = obs_href;
      $.each(observations.items,function() {
        var stamp = new Date();
        stamp.setISO8601(this.timestamp);
        data[i]["range"].push(this.value);
        data[i]["domain"].push(stamp.getTime());
      });
    });
    console.log(data);
  });
  chronoscope.Chronoscope.setFontBookRendering(true);
  chronoscope.Chronoscope.setErrorReporting(true);
  chronoscope.Chronoscope.setFontBookServiceEndpoint("http://api.timepedia.org/fr"); 

  chronoscope.Chronoscope.createTimeseriesChartById(id, data, 650, 433, 
    function(view) {
      view.getChart().redraw();
    });
  console.log("done.");
}
