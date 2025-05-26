require('dotenv').config(); // Ensure this is at the top if you're using .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const riderRoutes = require('./routes/rider');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');

const app = express();
const server = http.createServer(app);

// ✅ Use the correct frontend origin here
const CLIENT_URL = 'http://localhost:5173'; // Or use process.env.CLIENT_URL if using .env

// ✅ CORS Configuration for Express

const allowedOrigins = process.env.CLIENT_URLS.split(',');

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// ✅ CORS Configuration for Socket.IO
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api/rider', riderRoutes);

app.use('/api/location', locationRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/eco-saathi')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.IO Event Handlers
io.on('connection', (socket) => {
    console.log(`🟢 New socket connection: ${socket.id}`);

    socket.on('locationUpdate', (data) => {
        const { collectorId, lat, lng } = data;
        if (!collectorId || typeof lat !== 'number' || typeof lng !== 'number') {
            console.warn('⚠️ Invalid location data received');
            return;
        }
        console.log(`📍 Location from ${collectorId}: (${lat}, ${lng})`);
        socket.broadcast.emit('receiveLocation', data);
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
