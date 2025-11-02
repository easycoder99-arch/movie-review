import api from './api';

export const getMovieRatingStats = async (movieId) => {
  try {
    return await api.get(`/analytics/movie/${movieId}`);
  } catch (error) {
    throw new Error('Failed to fetch movie rating statistics');
  }
};

export const getUserRatingStats = async (userId) => {
  try {
    return await api.get(`/analytics/user/${userId}`);
  } catch (error) {
    throw new Error('Failed to fetch user rating statistics');
  }
};

export const getTopRatedCommunityMovies = async (limit = 10) => {
  try {
    return await api.get(`/analytics/movies/top-rated?limit=${limit}`);
  } catch (error) {
    throw new Error('Failed to fetch top rated community movies');
  }
};