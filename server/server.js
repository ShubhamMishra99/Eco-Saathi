const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');

const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.IO Configuration
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api/location', locationRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/eco-saathi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
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
