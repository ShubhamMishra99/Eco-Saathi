import React, { useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        vehicleType: 'Bicycle',
        rating: 4.5
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile(profile);
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile(profile);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem' }}>Rider Profile</h1>
            
            <div className="card">
                {isEditing ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="form-group">
                            <label className="form-label">Name:</label>
                            <input
                                className="form-input"
                                type="text"
                                name="name"
                                value={editedProfile.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email:</label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                value={editedProfile.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone:</label>
                            <input
                                className="form-input"
                                type="tel"
                                name="phone"
                                value={editedProfile.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Vehicle Type:</label>
                            <input
                                className="form-input"
                                type="text"
                                name="vehicleType"
                                value={editedProfile.vehicleType}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ margin: '0.5rem 0' }}>
                                <strong>Name:</strong> {profile.name}
                            </p>
                            <p style={{ margin: '0.5rem 0' }}>
                                <strong>Email:</strong> {profile.email}
                            </p>
                            <p style={{ margin: '0.5rem 0' }}>
                                <strong>Phone:</strong> {profile.phone}
                            </p>
                            <p style={{ margin: '0.5rem 0' }}>
                                <strong>Vehicle Type:</strong> {profile.vehicleType}
                            </p>
                            <p style={{ margin: '0.5rem 0' }}>
                                <strong>Rating:</strong>{' '}
                                <span style={{ color: 'var(--primary-green)' }}>★ {profile.rating}</span>
                            </p>
                        </div>
                        <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;