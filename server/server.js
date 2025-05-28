const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // <-- Required for socket.io
const { Server } = require('socket.io'); // <-- Import socket.io
const userRoutes = require('./routes/userRoutes');
const riderRoutes = require('./routes/riderRoutes');
const { setSocketInstance } = require('./controllers/userController'); // <-- Import socket handler

dotenv.config();
const app = express();
const server = http.createServer(app); // <-- Create HTTP server

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Pass io instance to controller
setSocketInstance(io);

// Middleware
app.use(cors());

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both Vite default ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/riders', riderRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyscrap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Socket.io connection listener (optional, for logging)
io.on('connection', (socket) => {
  console.log('Rider client connected:', socket.id);
});

// Start server

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

