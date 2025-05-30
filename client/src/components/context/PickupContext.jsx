import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://eco-saathi-2.onrender.com';

const PickupContext = createContext();

export const usePickup = () => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error('usePickup must be used within a PickupProvider');
  }
  return context;
};

export const PickupProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [livePickups, setLivePickups] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onOrderAcceptedCallback, setOnOrderAcceptedCallback] = useState(null);
  const [processingPickupId, setProcessingPickupId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);

  // Initialize socket connection when component mounts
  useEffect(() => {
    const token = localStorage.getItem('riderToken');
    if (!token) return;

    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.off('new-pickup');
        newSocket.off('pickup-status-update');
        newSocket.disconnect();
      }
    };
  }, []);

  // Handle new pickup notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewPickup = (pickupData) => {
      if (isAvailable) {
        // Check if pickup is already in live pickups or being processed
        setLivePickups(prev => {
          if (prev.some(p => p._id === pickupData._id) || processingPickupId === pickupData._id) {
            return prev;
          }
          return [pickupData, ...prev];
        });
        
        // Only show notification if it's a new pickup and not being processed
        if ((!currentPickup || currentPickup._id !== pickupData._id) && processingPickupId !== pickupData._id) {
          setCurrentPickup(pickupData);
          setShowNotificationModal(true);
        }
      }
    };

    socket.on('new-pickup', handleNewPickup);

    return () => {
      socket.off('new-pickup', handleNewPickup);
    };
  }, [socket, isAvailable, currentPickup, processingPickupId]);

  const handleCompletePickup = async (order, completionData) => {
    try {
      setIsLoading(true);
      setError(null);
      setProcessingPickupId(order.pickup._id);

      const token = localStorage.getItem('riderToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/riders/complete-pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pickupId: order.pickup._id,
          actualQuantity: completionData.actualQuantity,
          notes: completionData.notes
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete pickup');
      }

      // Emit event for order updates
      if (socket) {
        socket.emit('pickup-status-update', {
          pickupId: order.pickup._id,
          status: 'completed'
        });
      }

      // Notify subscribers that an order was completed
      if (onOrderAcceptedCallback) {
        onOrderAcceptedCallback();
      }

      setShowCompletionModal(false);
      setSelectedPickup(null);

      return data;
    } catch (error) {
      console.error('Error completing pickup:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
      setProcessingPickupId(null);
    }
  };

  const handleAcceptPickup = async () => {
    try {
      // Check if pickup is already being processed
      if (processingPickupId === currentPickup._id) {
        throw new Error('This pickup request is already being processed');
      }

      setIsLoading(true);
      setError(null);
      setProcessingPickupId(currentPickup._id);
      
      const token = localStorage.getItem('riderToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/riders/accept-pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pickupId: currentPickup._id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept pickup');
      }

      // Remove the pickup from live pickups
      setLivePickups(prev => prev.filter(p => p._id !== currentPickup._id));
      setShowNotificationModal(false);
      setCurrentPickup(null);

      // Emit event for order updates
      if (socket) {
        socket.emit('pickup-status-update', {
          pickupId: currentPickup._id,
          status: 'accepted'
        });
      }

      // Notify subscribers that an order was accepted
      if (onOrderAcceptedCallback) {
        onOrderAcceptedCallback();
      }

      return data;
    } catch (error) {
      console.error('Error accepting pickup:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
      setProcessingPickupId(null);
    }
  };

  const handleDeclinePickup = async () => {
    try {
      // Check if pickup is already being processed
      if (processingPickupId === currentPickup._id) {
        throw new Error('This pickup request is already being processed');
      }

      setIsLoading(true);
      setError(null);
      setProcessingPickupId(currentPickup._id);

      const token = localStorage.getItem('riderToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/riders/decline-pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pickupId: currentPickup._id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to decline pickup');
      }

      // Remove the pickup from live pickups
      setLivePickups(prev => prev.filter(p => p._id !== currentPickup._id));
      setShowNotificationModal(false);
      setCurrentPickup(null);
    } catch (error) {
      console.error('Error declining pickup:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
      setProcessingPickupId(null);
    }
  };

  const value = {
    livePickups,
    showNotificationModal,
    setShowNotificationModal,
    currentPickup,
    setCurrentPickup,
    isAvailable,
    setIsAvailable,
    isLoading,
    error,
    handleAcceptPickup,
    handleDeclinePickup,
    handleCompletePickup,
    setOnOrderAcceptedCallback,
    showCompletionModal,
    setShowCompletionModal,
    selectedPickup,
    setSelectedPickup
  };

  return (
    <PickupContext.Provider value={value}>
      {children}
    </PickupContext.Provider>
  );
}; 