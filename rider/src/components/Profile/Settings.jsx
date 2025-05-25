import React, { useState } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({
            ...settings,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to update settings
        console.log('Settings updated:', settings);
    };

    return (
        <div>
            <h2>Account Settings</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={settings.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={settings.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Settings</button>
            </form>
        </div>
    );
};

export default Settings;