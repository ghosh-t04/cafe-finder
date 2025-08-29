let map, service, infowindow;

function initMap() {
  const center = { lat: 28.6139, lng: 77.2090 }; // Default: New Delhi
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });
  infowindow = new google.maps.InfoWindow();
}

function findCafes() {
  const query = document.getElementById("searchBox").value || "cafes near me";

  const request = {
    query: query,
    fields: ["name", "geometry", "formatted_address"],
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach((place) => {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
      });

      // Show in sidebar
      const cafeDiv = document.createElement("div");
      cafeDiv.classList.add("cafe-item");
      cafeDiv.innerHTML = `<strong>${place.name}</strong><br>${place.formatted_address || ""}`;
      resultsDiv.appendChild(cafeDiv);
    });

    map.setCenter(results[0].geometry.location);
  } else {
    resultsDiv.innerHTML = "<p>No cafes found. Try again!</p>";
  }
}
