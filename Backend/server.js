const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Improved body parsing setup
app.use(cors());

// Configure JSON body parser with more lenient settings
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON in request body:', e.message);
    }
  }
}));

// Configure URL-encoded body parser
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb' 
}));

// Enhanced debug middleware after body parsing
app.use((req, res, next) => {
  if (req.path.includes('/auth/')) {
    console.log('Auth request to path:', req.path);
    console.log('Content-Type:', req.headers['content-type']);
    
    // For sensitive routes, don't log the full password
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '********';
    }
    console.log('Parsed Body (sanitized):', sanitizedBody);
  }
  next();
});

// Import database models
const { syncDatabase } = require('./models');

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes Management System API.' });
});

// Test route for JSON body parsing
app.post('/test-json', (req, res) => {
  console.log('Test JSON endpoint hit:', req.body);
  res.json({ 
    received: true, 
    body: req.body,
    contentType: req.headers['content-type']
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/notes', require('./routes/notes.routes'));

// Set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  
  // Sync database
  await syncDatabase();
});