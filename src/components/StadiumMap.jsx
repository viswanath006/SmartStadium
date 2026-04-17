import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer, Marker } from '@react-google-maps/api';

const STADIUM_LOCATION = { lat: 17.4065, lng: 78.5505 };

// Premium Dark Mode Map Style
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

const StadiumMap = ({ heatPoints = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_KEY_HERE',
    libraries: ['visualization']
  });

  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    return heatPoints.map(point => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      weight: point.weight
    }));
  }, [heatPoints, isLoaded]);

  if (!isLoaded) return <div style={{ color: 'var(--accent-cyan)' }}>Loading Maps Engine...</div>;

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={STADIUM_LOCATION}
        zoom={17}
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
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(StadiumMap);
