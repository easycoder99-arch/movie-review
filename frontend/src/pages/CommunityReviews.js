import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllReviews } from '../services/reviewService';

const CommunityReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const data = await getAllReviews(20, loadMore ? lastVisible : null);
      
      if (loadMore) {
        setReviews(prev => [...prev, ...data.reviews]);
      } else {
        setReviews(data.reviews);
      }
      
      setLastVisible(data.lastVisible);
      setHasMore(data.reviews.length === 20);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      loadReviews(true);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-2">Loading community reviews...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center text-light mb-4">Community Reviews</h1>
          <p className="text-center text-light mb-5">
            See what the community is saying about movies
          </p>

          <Row>
            {reviews.map(review => (
              <Col key={review.id} lg={6} className="mb-4">
                <Card className="movie-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-start mb-3">
                      <img
                        src={
                          review.moviePoster
                            ? `https://image.tmdb.org/t/p/w200${review.moviePoster}`
                            : '/placeholder-movie.jpg'
                        }
                        alt={review.movieTitle}
                        style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '5px' }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <Card.Title className="mb-1" style={{ fontSize: '1.1rem' }}>
                          {review.movieTitle}
                        </Card.Title>
                        <div className="d-flex align-items-center mb-2">
                          <div className="badge bg-warning text-dark me-2">
                            ⭐ {review.rating}/5
                          </div>
                          <small className="text-muted">by {review.userName}</small>
                        </div>
                      </div>
                    </div>
                    
                    <Card.Text className="flex-grow-1" style={{ fontStyle: 'italic' }}>
                      "{review.comment}"
                    </Card.Text>
                    
                    <small className="text-muted mb-3">
                      {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString()}
                    </small>
                    
                    <Link to={`/movie/${review.movieId}`}>
                      <Button variant="outline-primary" size="sm" className="w-100">
                        View Movie Details
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {reviews.length === 0 && (
            <div className="text-center py-5">
              <h4 className="text-light">No reviews yet</h4>
              <p className="text-muted">Be the first to write a review!</p>
              <Link to="/browse">
                <Button variant="primary">Browse Movies</Button>
              </Link>
            </div>
          )}

          {hasMore && reviews.length > 0 && (
            <div className="text-center mt-4">
              <Button 
                variant="outline-light" 
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Reviews'
                )}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityReviews;