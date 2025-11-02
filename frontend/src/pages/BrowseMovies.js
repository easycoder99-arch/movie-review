import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { searchMovies, getPopularMovies, getTrendingMovies, getTopRatedMovies } from '../services/movieService';

const BrowseMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('popular');

  const filter = searchParams.get('filter') || 'popular';

  useEffect(() => {
    loadMovies(filter);
    setActiveFilter(filter);
  }, [filter]);

  const loadMovies = async (filterType = 'popular', query = '') => {
    try {
      setLoading(true);
      setError('');

      let data;
      switch (filterType) {
        case 'trending':
          data = await getTrendingMovies();
          break;
        case 'top-rated':
          data = await getTopRatedMovies();
          break;
        case 'search':
          data = await searchMovies(query);
          break;
        default:
          data = await getPopularMovies();
      }

      setMovies(data.results || []);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadMovies('popular');
      setSearchParams({ filter: 'popular' });
      return;
    }

    setSearchParams({ filter: 'search' });
    loadMovies('search', searchQuery);
  };

  const handleFilterChange = (newFilter) => {
    setSearchParams({ filter: newFilter });
  };

  const MovieCard = ({ movie }) => (
    <Col xl={2} lg={3} md={4} sm={6} className="mb-4">
      <Card className="movie-card h-100">
        <Card.Img 
          variant="top" 
          src={
            movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.jpg'
          }
          style={{ height: '300px', objectFit: 'cover' }}
          alt={movie.title}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
            {movie.title}
          </Card.Title>
          <div className="mt-auto">
            <small className="text-muted d-block">
              {movie.release_date?.split('-')[0]}
            </small>
            <span className="badge bg-warning text-dark">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-muted ms-2">
              ({movie.vote_count} votes)
            </span>
          </div>
          <Link to={`/movie/${movie.id}`} className="mt-2">
            <Button variant="outline-primary" size="sm" className="w-100">
              View Details & Reviews
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-light mb-4">Browse Movies</h1>
          
          {/* Search Section */}
          <div className="search-section">
            <Form onSubmit={handleSearch} className="mb-4">
              <Row>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="Search for movies by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                  />
                </Col>
                <Col md={4}>
                  <Button type="submit" variant="primary" size="lg" className="w-100">
                    Search Movies
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Filter Buttons */}
            <div className="text-center">
              <ButtonGroup>
                <Button
                  variant={activeFilter === 'popular' ? 'primary' : 'outline-primary'}
                  onClick={() => handleFilterChange('popular')}
                >
                  Popular
                </Button>
                <Button
                  variant={activeFilter === 'trending' ? 'primary' : 'outline-primary'}
                  onClick={() => handleFilterChange('trending')}
                >
                  Trending
                </Button>
                <Button
                  variant={activeFilter === 'top-rated' ? 'primary' : 'outline-primary'}
                  onClick={() => handleFilterChange('top-rated')}
                >
                  Top Rated
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" variant="light" />
              <span className="ms-2 text-light">Loading movies...</span>
            </div>
          ) : (
            <>
              <Row>
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </Row>

              {movies.length === 0 && (
                <div className="text-center py-5">
                  <h4 className="text-light">No movies found</h4>
                  <p className="text-light">
                    {activeFilter === 'search' 
                      ? 'Try a different search term.'
                      : 'Unable to load movies. Please try again later.'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const MovieCard = ({ movie }) => (
  <Col xl={2} lg={3} md={4} sm={6} className="mb-4">
    <Card className="movie-card h-100">
      <Card.Img 
        variant="top" 
        src={
          movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/placeholder-movie.jpg'
        }
        style={{ height: '300px', objectFit: 'cover' }}
        alt={movie.title}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
          {movie.title}
        </Card.Title>
        
        {/* Rating Section */}
        <div className="rating-section mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="tmdb-rating">
              <small className="text-muted">TMDB:</small>
              <div className="d-flex align-items-center">
                <span className="text-warning">⭐</span>
                <small className="ms-1">{movie.vote_average?.toFixed(1)}</small>
              </div>
            </div>
            <div className="votes">
              <small className="text-muted">({movie.vote_count} votes)</small>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <small className="text-muted d-block">
            {movie.release_date?.split('-')[0]}
          </small>
          <Link to={`/movie/${movie.id}`} className="mt-2">
            <Button variant="outline-primary" size="sm" className="w-100">
              View Details & Reviews
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  </Col>
);
export default BrowseMovies;