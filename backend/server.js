const express = require('express');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/analytics', analyticsRoutes);

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Movie Review API is running!',
    endpoints: {
      movies: '/api/movies',
      reviews: '/api/reviews'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});