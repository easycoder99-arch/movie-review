import api from './api';

export const searchMovies = async (query) => {
  try {
    console.log('Searching movies with query:', query);
    const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}`);
    console.log('Search results:', response.results?.length || 0, 'movies found');
    return response;
  } catch (error) {
    console.error('Search movies error:', error);
    throw new Error(`Failed to search movies: ${error.message}`);
  }
};

export const getPopularMovies = async () => {
  try {
    console.log('Fetching popular movies...');
    const response = await api.get('/movies/popular');
    console.log('Popular movies loaded:', response.results?.length || 0, 'movies');
    return response;
  } catch (error) {
    console.error('Get popular movies error:', error);
    throw new Error(`Failed to load popular movies: ${error.message}`);
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await api.get('/movies/trending');
    return response;
  } catch (error) {
    console.error('Get trending movies error:', error);
    throw new Error(`Failed to load trending movies: ${error.message}`);
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await api.get('/movies/top-rated');
    return response;
  } catch (error) {
    console.error('Get top rated movies error:', error);
    throw new Error(`Failed to load top rated movies: ${error.message}`);
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    console.log('Fetching movie details for ID:', movieId);
    const response = await api.get(`/movies/${movieId}`);
    return response;
  } catch (error) {
    console.error('Get movie details error:', error);
    throw new Error(`Failed to load movie details: ${error.message}`);
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await api.get(`/movies/${movieId}/credits`);
    return response;
  } catch (error) {
    console.error('Get movie credits error:', error);
    throw new Error(`Failed to load movie credits: ${error.message}`);
  }
};