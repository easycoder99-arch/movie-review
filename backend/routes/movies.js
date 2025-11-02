const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Enhanced mock movie data with proper poster paths
const mockMovies = {
  results: [
    {
      id: 278,
      title: "The Shawshank Redemption",
      poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      release_date: "1994-09-23",
      vote_average: 9.3,
      vote_count: 2500000,
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
    },
    {
      id: 238,
      title: "The Godfather",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      release_date: "1972-03-14",
      vote_average: 9.2,
      vote_count: 1800000,
      overview: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son."
    },
    {
      id: 155,
      title: "The Dark Knight",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      release_date: "2008-07-18",
      vote_average: 9.0,
      vote_count: 2600000,
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."
    },
    {
      id: 680,
      title: "Pulp Fiction",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      release_date: "1994-10-14",
      vote_average: 8.9,
      vote_count: 2000000,
      overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
    },
    {
      id: 13,
      title: "Forrest Gump",
      poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      release_date: "1994-07-06",
      vote_average: 8.8,
      vote_count: 1900000,
      overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75."
    },
    {
      id: 27205,
      title: "Inception",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      release_date: "2010-07-16",
      vote_average: 8.8,
      vote_count: 2300000,
      overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    }
  ]
};

// Helper function to get full image URL
const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper to process movie data and add full image URLs
const processMovieData = (movie) => ({
  ...movie,
  poster_url: getImageUrl(movie.poster_path),
  backdrop_url: getImageUrl(movie.backdrop_path, 'w1280')
});

// Check if we have a valid TMDB API key
const hasValidTMDBKey = () => {
  return TMDB_API_KEY && 
         TMDB_API_KEY !== 'your_tmdb_api_key_here' && 
         !TMDB_API_KEY.includes('your_tmdb_api_key');
};

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    console.log('Fetching popular movies...');
    
    // If no valid API key, return mock data
    if (!hasValidTMDBKey()) {
      console.log('Using mock movie data (no valid TMDB API key)');
      const processedMovies = {
        ...mockMovies,
        results: mockMovies.results.map(processMovieData)
      };
      return res.json(processedMovies);
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`
    );
    
    // Process the data to add full image URLs
    const processedData = {
      ...response.data,
      results: response.data.results.map(processMovieData)
    };
    
    res.json(processedData);
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    // Fallback to mock data if API fails
    const processedMovies = {
      ...mockMovies,
      results: mockMovies.results.map(processMovieData)
    };
    res.json(processedMovies);
  }
});

// Search movies - FIXED VERSION
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Searching for:', query);
    
    if (!hasValidTMDBKey()) {
      const filteredMovies = {
        results: mockMovies.results
          .filter(movie => query ? movie.title.toLowerCase().includes(query.toLowerCase()) : true)
          .map(processMovieData)
      };
      return res.json(filteredMovies);
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    
    const processedData = {
      ...response.data,
      results: response.data.results.map(processMovieData)
    };
    
    res.json(processedData);
  } catch (error) {
    console.error('TMDB Search Error:', error.message);
    // FIXED: Use the correct query variable
    const searchQuery = req.query.query;
    const filteredMovies = {
      results: mockMovies.results
        .filter(movie => searchQuery ? movie.title.toLowerCase().includes(searchQuery.toLowerCase()) : true)
        .map(processMovieData)
    };
    res.json(filteredMovies);
  }
});

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    if (!hasValidTMDBKey()) {
      const processedMovies = {
        ...mockMovies,
        results: mockMovies.results.map(processMovieData)
      };
      return res.json(processedMovies);
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    
    const processedData = {
      ...response.data,
      results: response.data.results.map(processMovieData)
    };
    
    res.json(processedData);
  } catch (error) {
    console.error('TMDB Trending Error:', error.message);
    const processedMovies = {
      ...mockMovies,
      results: mockMovies.results.map(processMovieData)
    };
    res.json(processedMovies);
  }
});

// Get top rated movies
router.get('/top-rated', async (req, res) => {
  try {
    if (!hasValidTMDBKey()) {
      const processedMovies = {
        ...mockMovies,
        results: mockMovies.results.map(processMovieData)
      };
      return res.json(processedMovies);
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    
    const processedData = {
      ...response.data,
      results: response.data.results.map(processMovieData)
    };
    
    res.json(processedData);
  } catch (error) {
    console.error('TMDB Top Rated Error:', error.message);
    const processedMovies = {
      ...mockMovies,
      results: mockMovies.results.map(processMovieData)
    };
    res.json(processedMovies);
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!hasValidTMDBKey()) {
      const movie = mockMovies.results.find(m => m.id === parseInt(id)) || {
        id: parseInt(id),
        title: "Sample Movie",
        overview: "This is a sample movie description for development purposes.",
        release_date: "2023-01-01",
        runtime: 120,
        vote_average: 8.5,
        vote_count: 1000,
        genres: [{ id: 1, name: "Drama" }, { id: 2, name: "Action" }],
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        backdrop_path: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
        tagline: "An amazing movie tagline"
      };
      return res.json(processMovieData(movie));
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
    );
    
    res.json(processMovieData(response.data));
  } catch (error) {
    console.error('TMDB Movie Details Error:', error.message);
    const movie = mockMovies.results.find(m => m.id === parseInt(req.params.id)) || {
      id: parseInt(req.params.id),
      title: "Sample Movie",
      overview: "This is a sample movie description for development purposes.",
      release_date: "2023-01-01",
      runtime: 120,
      vote_average: 8.5,
      vote_count: 1000,
      genres: [{ id: 1, name: "Drama" }, { id: 2, name: "Action" }],
      poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
    };
    res.json(processMovieData(movie));
  }
});

// Get movie credits
router.get('/:id/credits', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!hasValidTMDBKey()) {
      const mockCredits = {
        cast: [
          { 
            name: "Tim Robbins", 
            character: "Andy Dufresne",
            profile_path: "/hs25LdLC0DLPQpQjQ6YO1gXRQlU.jpg"
          },
          { 
            name: "Morgan Freeman", 
            character: "Ellis Boyd 'Red' Redding",
            profile_path: "/oIciQ9F2DcVKl5vSKp1oqq4Qshh.jpg"
          }
        ]
      };
      return res.json(mockCredits);
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('TMDB Credits Error:', error.message);
    const mockCredits = {
      cast: [
        { name: "Sample Actor", character: "Main Role" },
        { name: "Another Actor", character: "Supporting Role" }
      ]
    };
    res.json(mockCredits);
  }
});

module.exports = router;