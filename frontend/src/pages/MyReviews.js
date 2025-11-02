import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUserReviews, deleteReview } from '../services/reviewService';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = {
    userId: 'user123',
    userName: 'Current User'
  };

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserReviews(currentUser.userId);
      setReviews(data);
    } catch (err) {
      setError(err.message || 'Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
      } catch (err) {
        setError('Failed to delete review');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-2">Loading your reviews...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center text-light mb-4">My Reviews</h1>
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
              <Button variant="outline-danger" size="sm" onClick={loadUserReviews} className="ms-2">
                Try Again
              </Button>
            </Alert>
          )}

          {reviews.length === 0 && !error ? (
            <div className="text-center py-5">
              <h4 className="text-light">No reviews yet</h4>
              <p className="text-muted mb-4">Start reviewing movies to see them here!</p>
              <Link to="/browse">
                <Button variant="primary">Browse Movies</Button>
              </Link>
            </div>
          ) : (
            <Row>
              {reviews.map(review => (
                <Col key={review.id} lg={6} className="mb-4">
                  <Card className="movie-card h-100">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-start mb-3">
                        <img
                          src={review.moviePoster ? 
                            `https://image.tmdb.org/t/p/w200${review.moviePoster}` : 
                            '/placeholder-movie.jpg'
                          }
                          alt={review.movieTitle}
                          style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '5px' }}
                          className="me-3"
                          onError={(e) => e.target.src = '/placeholder-movie.jpg'}
                        />
                        <div className="flex-grow-1">
                          <Card.Title className="mb-1">{review.movieTitle}</Card.Title>
                          <div className="badge bg-warning text-dark">
                            ⭐ {review.rating}/5
                          </div>
                        </div>
                      </div>
                      
                      <Card.Text className="flex-grow-1">
                        {review.comment}
                      </Card.Text>
                      
                      <small className="text-muted mb-3">
                        Reviewed on {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString()}
                      </small>
                      
                      <div className="d-flex gap-2">
                        <Link to={`/movie/${review.movieId}`} className="flex-grow-1">
                          <Button variant="outline-primary" size="sm" className="w-100">
                            View Movie
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyReviews;