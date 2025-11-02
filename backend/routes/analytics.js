const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Get movie rating statistics
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviewsRef = db.collection('reviews');
    const snapshot = await reviewsRef
      .where('movieId', '==', movieId)
      .get();

    let totalRating = 0;
    let reviewCount = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    snapshot.forEach(doc => {
      const review = doc.data();
      totalRating += review.rating;
      reviewCount++;
      
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating]++;
      }
    });

    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

    res.json({
      movieId,
      averageRating: parseFloat(averageRating),
      totalReviews: reviewCount,
      ratingDistribution,
      percentageDistribution: Object.keys(ratingDistribution).reduce((acc, rating) => {
        acc[rating] = reviewCount > 0 ? (ratingDistribution[rating] / reviewCount * 100).toFixed(1) : 0;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user rating statistics
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reviewsRef = db.collection('reviews');
    const snapshot = await reviewsRef
      .where('userId', '==', userId)
      .get();

    let totalRating = 0;
    let reviewCount = 0;
    const ratingPattern = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    snapshot.forEach(doc => {
      const review = doc.data();
      totalRating += review.rating;
      reviewCount++;
      ratingPattern[review.rating]++;
    });

    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

    res.json({
      userId,
      totalReviews: reviewCount,
      averageRating: parseFloat(averageRating),
      ratingPattern,
      ratingSeverity: reviewCount > 0 ? {
        generous: ((ratingPattern[4] + ratingPattern[5]) / reviewCount * 100).toFixed(1),
        critical: ((ratingPattern[1] + ratingPattern[2]) / reviewCount * 100).toFixed(1),
        neutral: (ratingPattern[3] / reviewCount * 100).toFixed(1)
      } : { generous: 0, critical: 0, neutral: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top rated movies from our community
router.get('/movies/top-rated', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const reviewsRef = db.collection('reviews');
    const snapshot = await reviewsRef.get();

    const movieStats = {};

    snapshot.forEach(doc => {
      const review = doc.data();
      if (!movieStats[review.movieId]) {
        movieStats[review.movieId] = {
          movieTitle: review.movieTitle,
          moviePoster: review.moviePoster,
          totalRating: 0,
          reviewCount: 0,
          ratings: []
        };
      }
      
      movieStats[review.movieId].totalRating += review.rating;
      movieStats[review.movieId].reviewCount++;
      movieStats[review.movieId].ratings.push(review.rating);
    });

    // Calculate average and filter movies with minimum reviews
    const moviesWithStats = Object.entries(movieStats)
      .map(([movieId, stats]) => ({
        movieId,
        ...stats,
        averageRating: stats.totalRating / stats.reviewCount
      }))
      .filter(movie => movie.reviewCount >= 3) // Minimum 3 reviews
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, parseInt(limit));

    res.json(moviesWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;