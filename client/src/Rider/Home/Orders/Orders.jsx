import React, { useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('assign');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    actualWeight: '',
    actualScrapType: '',
    notes: '',
    pickupTime: '',
    status: 'assign'
  });

  const filteredOrders = orders.filter(order => order.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'assign':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setFormData({
      actualWeight: '',
      actualScrapType: order.scrapType,
      notes: '',
      pickupTime: '',
      status: order.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setFormData({
      actualWeight: '',
      actualScrapType: '',
      notes: '',
      pickupTime: '',
      status: 'assign'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the order
    console.log('Updated order data:', {
      orderId: selectedOrder.id,
      ...formData
    });
    handleCloseModal();
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    setShowCancelModal(true);
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to cancel the order
    console.log('Order cancelled:', {
      orderId: selectedOrder.id,
      reason: cancelReason
    });
    setShowCancelModal(false);
    setCancelReason('');
    handleCloseModal();
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-content">
          <h2>Orders</h2>
        </div>
        <div className="orders-tabs">
          <button
            className={`tab-button ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => setActiveTab('assign')}
          >
            Assign
          </button>
          <button
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="order-card"
              onClick={() => handleOrderClick(order)}
            >
              <div className="order-header">
                <h3>#{order.id}</h3>
              </div>

              <div className="order-details">
                <div className="detail-section customer-section">
                  <h4>Customer Details</h4>
                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <span>{order.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{order.address}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{order.contact}</span>
                  </div>
                </div>

                <div className="detail-section item-section">
                  <h4>Item Details</h4>
                  <div className="detail-item">
                    <i className="fas fa-recycle"></i>
                    <span>{order.scrapType}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-weight-hanging"></i>
                    <span>{order.weight}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{order.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <i className="fas fa-inbox"></i>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="modal-section">
                <h4>Customer Information</h4>
                <div className="modal-details">
                  <div className="modal-detail-item">
                    <span className="label">Name:</span>
                    <span className="value">{selectedOrder.customerName}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="label">Contact:</span>
                    <span className="value">{selectedOrder.contact}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="label">Address:</span>
                    <span className="value">{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'completed' ? (
                <>
                  <div className="modal-section">
                    <h4>Original Request</h4>
                    <div className="modal-details">
                      <div className="modal-detail-item">
                        <span className="label">Scrap Type:</span>
                        <span className="value">{selectedOrder.originalData.scrapType}</span>
                      </div>
                      <div className="modal-detail-item">
                        <span className="label">Estimated Weight:</span>
                        <span className="value">{selectedOrder.originalData.weight}</span>
                      </div>
                      <div className="modal-detail-item">
                        <span className="label">Requested Time:</span>
                        <span className="value">{selectedOrder.originalData.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4>Updated Details</h4>
                    <div className="modal-details">
                      <div className="modal-detail-item">
                        <span className="label">Actual Scrap Type:</span>
                        <span className="value">{selectedOrder.updatedData.scrapType}</span>
                      </div>
                      <div className="modal-detail-item">
                        <span className="label">Actual Weight:</span>
                        <span className="value">{selectedOrder.updatedData.weight}</span>
                      </div>
                      <div className="modal-detail-item">
                        <span className="label">Pickup Time:</span>
                        <span className="value">{selectedOrder.updatedData.time}</span>
                      </div>
                      {selectedOrder.updatedData.notes && (
                        <div className="modal-detail-item">
                          <span className="label">Notes:</span>
                          <span className="value">{selectedOrder.updatedData.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : selectedOrder.status === 'cancelled' ? (
                <div className="modal-section">
                  <h4>Cancellation Details</h4>
                  <div className="modal-details">
                    <div className="modal-detail-item">
                      <span className="label">Original Request:</span>
                      <span className="value">{selectedOrder.originalData.scrapType} - {selectedOrder.originalData.weight}</span>
                    </div>
                    <div className="modal-detail-item">
                      <span className="label">Cancellation Reason:</span>
                      <span className="value">{selectedOrder.updatedData.reason}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="modal-section">
                  <h4>Update Item Details</h4>
                  <div className="form-group">
                    <label htmlFor="actualScrapType">Scrap Type</label>
                    <select
                      id="actualScrapType"
                      name="actualScrapType"
                      value={formData.actualScrapType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Paper">Paper</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Metal">Metal</option>
                      <option value="Glass">Glass</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="actualWeight">Actual Weight (kg)</label>
                    <input
                      type="number"
                      id="actualWeight"
                      name="actualWeight"
                      value={formData.actualWeight}
                      onChange={handleInputChange}
                      placeholder="Enter actual weight"
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pickupTime">Pickup Time</label>
                    <select
                      id="pickupTime"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00-10:00">09:00 AM - 10:00 AM</option>
                      <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                      <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                      <option value="12:00-13:00">12:00 PM - 01:00 PM</option>
                      <option value="13:00-14:00">01:00 PM - 02:00 PM</option>
                      <option value="14:00-15:00">02:00 PM - 03:00 PM</option>
                      <option value="15:00-16:00">03:00 PM - 04:00 PM</option>
                      <option value="16:00-17:00">04:00 PM - 05:00 PM</option>
                      <option value="17:00-18:00">05:00 PM - 06:00 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any additional notes or observations"
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {selectedOrder.status === 'assign' && (
                <div className="modal-actions">
                  <button type="button" className="action-button cancel" onClick={handleCancelClick}>
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                  <button type="submit" className="action-button accept">
                    <i className="fas fa-check"></i>
                    Update Order
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay" onClick={handleCloseCancelModal}>
          <div className="modal-content cancel-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Order #{selectedOrder?.id}</h3>
              <button className="close-button" onClick={handleCloseCancelModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCancelSubmit}>
              <div className="modal-section">
                <h4>Reason for Cancellation</h4>
                <div className="form-group">
                  <label htmlFor="cancelReason">Please provide a reason for cancelling this order</label>
                  <textarea
                    id="cancelReason"
                    name="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter the reason for cancellation..."
                    required
                    rows="4"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="action-button cancel" onClick={handleCloseCancelModal}>
                  <i className="fas fa-times"></i>
                  Back
                </button>
                <button type="submit" className="action-button cancel-confirm">
                  <i className="fas fa-ban"></i>
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 