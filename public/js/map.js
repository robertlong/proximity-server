  var map;
  var markers = [];

  $('input#pac-input').keypress(function(e) {
    if (e.keyCode == '13') {
      e.preventDefault();
    }
  });

  function initialize() {
    var mapOptions = {
      zoom: 15
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(input);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        $("#latitude").val(pos.pb);
        $("#longitude").val(pos.qb);

        var marker = new google.maps.Marker({
            map:map,
            draggable:true,
            animation: google.maps.Animation.DROP,
            position: pos
        });

        google.maps.event.addListener(marker, 'dragend', function() {
            var curPos = marker.getPosition();
            $("#latitude").val(curPos.pb);
            $("#longitude").val(curPos.qb);
        });

        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function() {
          var places = searchBox.getPlaces();
          var place = places[0];
          
          if (place) {
            var location = place.geometry.location;
            map.setCenter(location);
            
            marker.setPosition(location)

            var bounds = new google.maps.LatLngBounds();
            bounds.extend(location);
            map.fitBounds(bounds);

            $("#latitude").val(location.pb);
            $("#longitude").val(location.qb);
          }
        });

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
        });


        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }

  google.maps.event.addDomListener(window, 'load', initialize);