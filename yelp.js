var map
var markers=[]
var latitude=0
var longitude=0
var bounds=0
var ne=0
var radius=0
var radius_meter=0

function initialize () {
  var latnlong = {lat: 32.75, lng: -97.13};
  map = new google.maps.Map(document.getElementById('map'), {zoom: 16, center: latnlong});
  map.addListener('bounds_changed', function() {
    bounds =  map.getBounds();
    ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var center=map.getCenter();
    latitude=center.lat();
    longitude=center.lng();
    lat_center_rad=latitude/57.2958;
    long_center_rad=longitude/57.2958;
    lat_ne_rad=ne.lat()/57.2958;
    long_ne_rad=ne.lng()/57.2958;
    radius= 6378.7 * Math.acos(Math.sin(lat_center_rad) * Math.sin(lat_ne_rad) + Math.cos(lat_center_rad) * Math.cos(lat_ne_rad) * Math.cos(long_ne_rad - long_center_rad));
    //Formula to calculate radius is taken from http://www.meridianworlddata.com/distance-calculation/
    radius_meter=radius*1000
    radius_meter=Math.round(radius_meter)
  });
}

function sendRequest () {
   for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
   markers.length=0
   var out="<ol>"
   var xhr = new XMLHttpRequest();
   var value = encodeURI(document.getElementById("search").value);
   xhr.open("GET", "proxy.php?term="+value+"&latitude="+latitude+"&longitude="+longitude+"&radius="+radius_meter+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
          console.log(json.businesses.length)
          for(i=0;i<json.businesses.length;i++)
          {
            var count=i+1
            count=count.toString();
            var image_path=json.businesses[i].image_url
            var path=json.businesses[i].url
            var lati=json.businesses[i].coordinates.latitude
            var longi=json.businesses[i].coordinates.longitude
            out+="<li>"
            out+="<img src ="+image_path+" style='width:250px;height:250px;'>"+"<br/>"
            out+="Name: "
            out+="<a href='"+path+"'>"+json.businesses[i].name+"</a><br/>"
            out+="Rating: "
            out+=json.businesses[i].rating+"<br/>"
            out+="</li>"
            var marker = new google.maps.Marker({position: {lat: lati, lng: longi}, map: map, label: count, title:json.businesses[i].name});
            markers.push(marker)
          }
          document.getElementById("output").innerHTML=out+"</ol>"
       }
   };
   xhr.send(null);
}