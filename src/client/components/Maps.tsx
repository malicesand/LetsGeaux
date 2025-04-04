import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { TextField, Button, Box, Typography, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'; 

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 29.9511,  // New Orleans latitude
  lng: -90.0715, // New Orleans longitude
};

const libraries: any = ['geometry', 'marker']; 

const Maps = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);  
  const [itinerary, setItinerary] = useState<Array<any>>([]);
  const [openModal, setOpenModal] = useState<boolean>(false); 
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const originMarker = useRef<google.maps.Marker | null>(null);  
  const destinationMarker = useRef<google.maps.Marker | null>(null);  
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get('/api/itinerary');
        setItinerary(response.data); // Populate itinerary state
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };

    fetchItinerary();
  }, []);

  // Function to handle selecting an itinerary
  const handleSelectItinerary = async (id: string) => {
    try {
      // Send PATCH request with the selected itinerary's ID
      const response = await axios.patch('/api/maps', {
        itineraryId: id
      });
      
      if (response.status === 200) {
        console.log('Itinerary added successfully');
        setOpenModal(false); // Close the modal after successful selection
      } else {
        console.error('Failed to add itinerary');
      }
    } catch (error) {
      console.error('Error during PATCH request:', error);
    }
  };

  // Function to fetch directions and calculate the travel time
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

              const time = result.routes[0].legs[0].duration.text;
              setTravelTime(time);

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
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
    };
  }, []);

  const placeMarkers = (originLatLng: google.maps.LatLng, destinationLatLng: google.maps.LatLng) => {
    if (mapRef.current) {
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);

      originMarker.current = new google.maps.Marker({
        position: originLatLng,
        map: mapRef.current,
        title: "Origin",
      });

      destinationMarker.current = new google.maps.Marker({
        position: destinationLatLng,
        map: mapRef.current,
        title: "Destination",
      });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Google Maps Directions
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <TextField
          label="Enter the start address or place"
          variant="outlined"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <TextField
          label="Enter destination address or place"
          variant="outlined"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchDirections}
        >
          View Route
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {travelTime && <Typography variant="h6">Estimated Driving: {travelTime}</Typography>}

      <Box mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setOpenModal(true)} // Open the modal to display itinerary options
        >
          Select Itinerary
        </Button>
      </Box>

      <LoadScript
        googleMapsApiKey={'API_KEY'}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
        >
          {/* The markers will be placed automatically after directions are fetched */}
        </GoogleMap>
      </LoadScript>

      {/* Modal for itinerary options */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Itinerary Options</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Itinerary Options</Typography>
          <Box mt={2}>
            {itinerary.length > 0 ? (
              itinerary.map((trip, id) => (
                <Card key={id} variant="outlined" sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{trip.name}</Typography>
                    <Typography>{trip.notes}</Typography>
                  </CardContent>
                  {console.log(trip.id)}
                  <Button onClick={() => handleSelectItinerary(trip.id)}>Select</Button>
                </Card>
              ))
            ) : (
              <Typography>No itinerary available.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Maps;

