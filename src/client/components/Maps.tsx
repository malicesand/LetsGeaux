import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";

// Container style for the map
const containerStyle = {
  width: "100%",
  height: "500px",
};

// Default map center (New Orleans)
const center = {
  lat: 29.9511,  // New Orleans latitude
  lng: -90.0715, // New Orleans longitude
};

const libraries: any = ['geometry', 'marker']; // Include 'marker' library

const Maps = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const originMarker = useRef<google.maps.Marker | null>(null);  // Changed to Marker type
  const destinationMarker = useRef<google.maps.Marker | null>(null);  // Changed to Marker type
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Function to fetch directions
  const fetchDirections = async () => {
    if (!origin || !destination) {
      setError("Both origin and destination are required!");
      return;
    }

    try {
      const response = await axios.get("/api/maps/directions", {
        params: { origin, destination },
      });

      const { polyline } = response.data;

      if (polyline) {
        const path = google.maps.geometry.encoding.decodePath(polyline);

        // Create a Polyline object
        if (polylineRef.current) {
          polylineRef.current.setPath(path);
        } else {
          polylineRef.current = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          polylineRef.current.setMap(mapRef.current);
        }

        // Show the route using DirectionsRenderer
        const directionsRequest = {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        if (directionsService.current && directionsRenderer.current) {
          directionsService.current.route(directionsRequest, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.current.setDirections(result);
              setError(null);
              const originLatLng = result.routes[0].legs[0].start_location;
              const destinationLatLng = result.routes[0].legs[0].end_location;
              placeMarkers(originLatLng, destinationLatLng);
            } else {
              setError("No route found.");
            }
          });
        }
      }
    } catch (error) {
      setError("Error fetching directions. Please try again later.");
    }
  };

  // Handle map load and initialize DirectionsService and DirectionsRenderer
  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });
  };

  useEffect(() => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(mapRef.current);
    }

    return () => {
      // Clean up markers and polyline on component unmount
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
    };
  }, []);

  // Place the markers for origin and destination
  const placeMarkers = (originLatLng: google.maps.LatLng, destinationLatLng: google.maps.LatLng) => {
    if (mapRef.current) {
      // Remove previous markers if any
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);

      // Create new markers using the standard Marker API for origin
      originMarker.current = new google.maps.Marker({
        position: originLatLng,
        map: mapRef.current,
        title: "Origin",
      });

      // Create new markers using the standard Marker API for destination
      destinationMarker.current = new google.maps.Marker({
        position: destinationLatLng,
        map: mapRef.current,
        title: "Destination",
      });
    }
  };

  return (
    <div>
      <h1>Google Maps Directions</h1>

      {/* Input Fields */}
      <div>
        <input
          type="text"
          placeholder="Enter origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={fetchDirections}>Get Directions</button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Google Map */}
      <LoadScript
        googleMapsApiKey={'AIzaSyB9QqOy6HqcZACRrPbKWPd_bH0xnA2lA9w'}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          mapIds={['2321123bf55eea3e']}  
        >
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Maps;