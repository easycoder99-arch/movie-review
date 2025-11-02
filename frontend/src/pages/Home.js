import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPopularMovies, getTrendingMovies } from '../services/movieService';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomepageData();
  }, []);

  const loadHomepageData = async () => {
    try {
      const [popularData, trendingData] = await Promise.all([
        getPopularMovies(),
        getTrendingMovies()
      ]);
      
      setPopularMovies(popularData.results?.slice(0, 6) || []);
      setTrendingMovies(trendingData.results?.slice(0, 6) || []);
    } catch (error) {
      console.error('Failed to load homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MovieCard = ({ movie }) => (
    <Col lg={2} md={4} sm={6} className="mb-4">
      <Card className="movie-card h-100">
        <Card.Img 
          variant="top" 
          src={
            movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.jpg'
          }
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
            {movie.title}
          </Card.Title>
          <div className="mt-auto">
            <small className="text-muted">
              {movie.release_date?.split('-')[0]}
            </small>
            <br />
            <span className="badge bg-warning text-dark">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
          </div>
          <Link to={`/movie/${movie.id}`} className="mt-2">
            <Button variant="outline-primary" size="sm" className="w-100">
              View Details
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-4">Welcome to MovieReviewHub</h1>
              <p className="lead mb-4">
                Discover, review, and share your thoughts on the latest movies. 
                Join our community of movie enthusiasts!
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/browse">
                  <Button variant="primary" size="lg">Browse Movies</Button>
                </Link>
                <Link to="/community">
                  <Button variant="outline-light" size="lg">View Community</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        {/* Popular Movies Section */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-light">Popular Movies</h2>
              <Link to="/browse?filter=popular">
                <Button variant="outline-light">View All</Button>
              </Link>
            </div>
            <Row>
              {popularMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </Row>
          </Col>
        </Row>

        {/* Trending Movies Section */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-light">Trending This Week</h2>
              <Link to="/browse?filter=trending">
                <Button variant="outline-light">View All</Button>
              </Link>
            </div>
            <Row>
              {trendingMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </Row>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="text-center text-light movie-card h-100">
              <Card.Body>
                <div className="feature-icon mb-3">🎬</div>
                <Card.Title>Browse Movies</Card.Title>
                <Card.Text>
                  Explore thousands of movies from various genres and eras. 
                  Find your next favorite film.
                </Card.Text>
                <Link to="/browse">
                  <Button variant="outline-light">Start Browsing</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center text-light movie-card h-100">
              <Card.Body>
                <div className="feature-icon mb-3">⭐</div>
                <Card.Title>Write Reviews</Card.Title>
                <Card.Text>
                  Share your thoughts and rate movies. Help others discover 
                  great films through your reviews.
                </Card.Text>
                <Link to="/browse">
                  <Button variant="outline-light">Write Review</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center text-light movie-card h-100">
              <Card.Body>
                <div className="feature-icon mb-3">👥</div>
                <Card.Title>Join Community</Card.Title>
                <Card.Text>
                  See what others are watching and reviewing. 
                  Connect with fellow movie lovers.
                </Card.Text>
                <Link to="/community">
                  <Button variant="outline-light">View Community</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="text-center py-4 stats-section mb-5">
          <Col md={3}>
            <h3 className="fw-bold text-primary">10,000+</h3>
            <p className="text-light">Movies in Database</p>
          </Col>
          <Col md={3}>
            <h3 className="fw-bold text-success">5,000+</h3>
            <p className="text-light">User Reviews</p>
          </Col>
          <Col md={3}>
            <h3 className="fw-bold text-warning">1,000+</h3>
            <p className="text-light">Active Users</p>
          </Col>
          <Col md={3}>
            <h3 className="fw-bold text-info">50+</h3>
            <p className="text-light">Genres Available</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;