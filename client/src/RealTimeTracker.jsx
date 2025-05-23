// src/components/RealTimeTracker.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './RealTimeTracker.css';

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
    <div className="tracker-container">
      <h2 className="tracker-title">Real-time Location Tracker</h2>
      {error && <div className="error-message">{error}</div>}
      {location ? (
        <div className="location-info">
          <div className="location-data">
            <span>Latitude:</span>
            <span>{location.latitude}</span>
          </div>
          <div className="location-data">
            <span>Longitude:</span>
            <span>{location.longitude}</span>
          </div>
          <a 
            href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`} 
            target="_blank" 
            rel="noreferrer"
            className="map-link"
          >
            View on Map
          </a>
        </div>
      ) : (
        <p className="loading-text">Getting location...</p>
      )}
    </div>
  );
};

export default RealTimeTracker;
