// src/components/RealTimeTracker.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Change if deployed

const RealTimeTracker = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        socket.emit('locationUpdate', coords); // Send to server
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <h2>Real-time Location Tracker</h2>
      {error && <p>Error: {error}</p>}
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <a href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer">View on Map</a>
        </div>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
};

export default RealTimeTracker;
