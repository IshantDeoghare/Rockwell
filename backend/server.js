// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging

// Route to fetch data from FastAPI
app.get('/api/agv-schedule', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/schedule-results');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from FastAPI:', error.message);
    
    // Handle different types of errors properly
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      return res.status(error.response.status).json({
        status: 'error',
        message: error.response.data.detail || 'Error from FastAPI service',
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({
        status: 'error',
        message: 'FastAPI service unavailable. Make sure it is running on port 8000.'
      });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});