import React, { useMemo, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const STADIUM_LOCATION = { lat: 17.4065, lng: 78.5505 };
const SAMPLE_ORIGIN = { lat: 17.4399, lng: 78.4983 }; // Sample: Secunderabad

const darkMapTheme = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
];

const LIBRARIES = ['visualization', 'places'];

const StadiumMap = ({ heatPoints = [], triggerRoute = false }) => {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    return heatPoints.map(point => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      weight: point.weight
    }));
  }, [heatPoints, isLoaded]);

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
      } else {
        console.log('Directions response non-OK: ', response);
      }
    }
  };

  if (!isLoaded) return <div style={{ color: 'var(--accent-cyan)' }}>Loading Maps Engine...</div>;

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={STADIUM_LOCATION}
        zoom={14} // Adjusted to ensure origin fits in frame
        options={{ 
           styles: darkMapTheme,
           disableDefaultUI: true,
           zoomControl: true
        }}
      >
        <Marker position={STADIUM_LOCATION} title="Rajiv Gandhi Stadium" />
        
        {heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 40,
              opacity: 0.8,
              gradient: [
                'rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)', 'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)', 'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)', 'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)'
              ]
            }}
          />
        )}

        {/* Route Calculation Logic */}
        {triggerRoute && !directions && (
          <DirectionsService
            options={{
              destination: STADIUM_LOCATION,
              origin: SAMPLE_ORIGIN,
              travelMode: 'DRIVING'
            }}
            callback={directionsCallback}
          />
        )}

        {/* Route Rendering */}
        {directions && (
          <DirectionsRenderer
            options={{ directions: directions }}
          />
        )}

      </GoogleMap>
    </div>
  );
};

export default React.memo(StadiumMap);
