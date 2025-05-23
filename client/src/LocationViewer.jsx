// src/components/LocationViewer.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // same as backend URL

const LocationViewer = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    socket.on('locationUpdate', (data) => {
      setLocation(data);
    });

    return () => {
      socket.off('locationUpdate');
    };
  }, []);

  return (
    <div>
      <h2>Live Garbage Collector Location</h2>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <a href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer">Open in Map</a>
        </div>
      ) : (
        <p>Waiting for location...</p>
      )}
    </div>
  );
};

export default LocationViewer;
