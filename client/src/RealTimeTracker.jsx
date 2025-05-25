import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function RealTimeTracker() {
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
        socket.emit('locationUpdate', coords);
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

  const styles = {
    htmlBodyRoot: {
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    },
    trackerContainer: {
      position: 'relative',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
    },
    trackerTitle: {
      margin: 0,
      padding: '12px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '1.5rem',
      textAlign: 'center',
      flexShrink: 0,
      userSelect: 'none',
    },
    errorMessage: {
      color: 'red',
      padding: '10px',
      textAlign: 'center',
      flexShrink: 0,
    },
    loadingText: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: '#555',
    },
    mapIframe: {
      flexGrow: 1,
      border: 'none',
      width: '100%',
      height: '100%',
    },
  };

  return (
    <div style={styles.trackerContainer}>
      <h2 style={styles.trackerTitle}>Real-time Location Tracker</h2>
      {error && <div style={styles.errorMessage}>{error}</div>}

      {location ? (
        <iframe
          title="Live Location Map"
          style={styles.mapIframe}
          src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
          allowFullScreen
          loading="lazy"
          frameBorder="0"
        ></iframe>
      ) : (
        <p style={styles.loadingText}>Getting location...</p>
      )}
    </div>
  );
}
