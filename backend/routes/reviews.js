const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get user's reviews (updated to avoid composite index)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching reviews for user:', userId);
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const reviews = [];
    
    // Method 1: Get all and sort in memory (for small datasets)
    const snapshot = await db.collection('reviews')
      .where('userId', '==', userId)
      .get();

    snapshot.forEach(doc => {
      const reviewData = doc.data();
      reviews.push({ 
        id: doc.id, 
        ...reviewData
      });
    });

    // Sort by createdAt in memory (descending)
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });

    console.log(`Found ${reviews.length} reviews for user ${userId}`);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    
    // If it's still the index error, provide a better message
    if (error.message.includes('index') || error.code === 9) {
      return res.status(400).json({ 
        error: 'Database index is still building. Please try again in a few minutes.',
        details: 'The query requires a composite index that is being created.'
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Get all reviews for a movie (also update this to avoid index issues)
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    console.log('Fetching reviews for movie:', movieId);
    
    const reviews = [];
    
    // Get all and sort in memory
    const snapshot = await db.collection('reviews')
      .where('movieId', '==', movieId)
      .get();

    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    // Sort by createdAt in memory (descending)
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });

    console.log(`Found ${reviews.length} reviews for movie ${movieId}`);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews for movie:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Keep the other routes (create, update, delete) the same as before
router.post('/', async (req, res) => {
  try {
    const { movieId, movieTitle, userId, userName, rating, comment, moviePoster } = req.body;
    
    console.log('Creating review for user:', userId);
    
    if (!movieId || !userId) {
      return res.status(400).json({ error: 'Movie ID and User ID are required' });
    }

    const reviewData = {
      movieId,
      movieTitle: movieTitle || "Unknown Movie",
      userId,
      userName: userName || "Anonymous User",
      rating: parseInt(rating) || 0,
      comment: comment || "",
      moviePoster: moviePoster || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('reviews').add(reviewData);
    
    console.log('Review created with ID:', docRef.id);
    res.json({ id: docRef.id, ...reviewData });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    console.log('Updating review:', id);

    await db.collection('reviews').doc(id).update({
      rating: parseInt(rating),
      comment,
      updatedAt: new Date()
    });

    const updatedReview = await db.collection('reviews').doc(id).get();
    if (!updatedReview.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ id: updatedReview.id, ...updatedReview.data() });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting review:', id);

    const reviewDoc = await db.collection('reviews').doc(id).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await db.collection('reviews').doc(id).delete();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;