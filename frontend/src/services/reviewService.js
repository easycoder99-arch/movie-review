import api from './api';

export const getReviews = async (movieId) => {
  try {
    console.log('Fetching reviews for movie:', movieId);
    const response = await api.get(`/reviews/movie/${movieId}`);
    console.log('Reviews fetched:', response.length);
    return response;
  } catch (error) {
    console.error('Get reviews error:', error);
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }
};

export const createReview = async (reviewData) => {
  try {
    console.log('Creating review:', reviewData);
    const response = await api.post('/reviews', reviewData);
    console.log('Review created:', response);
    return response;
  } catch (error) {
    console.error('Create review error:', error);
    throw new Error(`Failed to create review: ${error.message}`);
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    console.log('Updating review:', reviewId, reviewData);
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    console.log('Review updated:', response);
    return response;
  } catch (error) {
    console.error('Update review error:', error);
    throw new Error(`Failed to update review: ${error.message}`);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    console.log('Deleting review:', reviewId);
    const response = await api.delete(`/reviews/${reviewId}`);
    console.log('Review deleted:', response);
    return response;
  } catch (error) {
    console.error('Delete review error:', error);
    throw new Error(`Failed to delete review: ${error.message}`);
  }
};

export const getUserReviews = async (userId) => {
  try {
    console.log('Fetching reviews for user:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const response = await api.get(`/reviews/user/${userId}`);
    console.log('User reviews fetched:', response.length);
    return response;
  } catch (error) {
    console.error('Get user reviews error:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 404) {
      throw new Error('No reviews found for this user');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while fetching reviews');
    } else {
      throw new Error(`Failed to load your reviews: ${error.message}`);
    }
  }
};

export const getAllReviews = async (limit = 20, lastVisible = null) => {
  try {
    let url = `/reviews?limit=${limit}`;
    if (lastVisible) {
      url += `&lastVisible=${lastVisible}`;
    }
    
    const response = await api.get(url);
    console.log('All reviews fetched:', response.reviews?.length);
    return response;
  } catch (error) {
    console.error('Get all reviews error:', error);
    throw new Error(`Failed to fetch all reviews: ${error.message}`);
  }
};