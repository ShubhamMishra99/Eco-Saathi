const express = require('express');//Creates the web server
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());//Allows frontend on different ports (e.g,localhost:3000)
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = 'mongodb+srv://mishrashubham8932:Shubh9956@ecosaathi.fzht13t.mongodb.net/ecosaathi?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api', authRoutes);

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
