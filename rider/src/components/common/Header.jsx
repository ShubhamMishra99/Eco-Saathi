import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Eco-Saathi Rider</h1>
                <nav>
                    <ul>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/requests">Requests</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;