import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, ListGroup } from 'react-bootstrap';
import { getMovieDetails, getMovieCredits } from '../services/movieService';
import { getReviews, createReview, updateReview, deleteReview } from '../services/reviewService';
import StarRating from '../components/StarRating';
import RatingDistribution from '../components/RatingDistribution';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    loadMovieData();
  }, [id]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      const [movieData, creditsData, reviewsData] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getReviews(id)
      ]);
      
      setMovie(movieData);
      setCredits(creditsData);
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to load movie data');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setReviewForm(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      
      // Mock user data - in real app, this would come from authentication
      const userData = {
        userId: 'user123',
        userName: 'Current User'
      };

      const reviewData = {
        movieId: id,
        movieTitle: movie.title,
        moviePoster: movie.poster_path,
        ...userData,
        ...reviewForm
      };

      if (editingReview) {
        await updateReview(editingReview.id, {
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });
      } else {
        await createReview(reviewData);
      }

      setReviewForm({ rating: 5, comment: '' });
      setEditingReview(null);
      loadMovieData(); // Reload reviews
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment
    });
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

  const cancelEdit = () => {
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  // Calculate average rating from reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-2">Loading movie details...</p>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert variant="danger">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* Movie Details Section */}
      <Row className="mb-4">
        <Col md={4}>
          <img
            src={
              movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-movie.jpg'
            }
            alt={movie.title}
            className="img-fluid rounded movie-poster"
          />
        </Col>
        <Col md={8}>
          <div className="text-light">
            <h1>{movie.title}</h1>
            {movie.tagline && (
              <p className="lead text-muted">{movie.tagline}</p>
            )}
            
            <div className="mb-3">
              <Badge bg="primary" className="me-2">
                {movie.release_date?.split('-')[0]}
              </Badge>
              <Badge bg="secondary" className="me-2">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </Badge>
              <Badge bg="info" className="me-2">
                TMDB: ⭐ {movie.vote_average?.toFixed(1)}
              </Badge>
            </div>

            <p>{movie.overview}</p>

            <div className="mb-3">
              <strong>Genres: </strong>
              {movie.genres?.map(genre => (
                <Badge key={genre.id} bg="outline-light" className="me-1">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Community Rating Summary */}
            <div className="community-rating mb-4">
              <h5>Community Rating</h5>
              <div className="d-flex align-items-center mb-2">
                <StarRating rating={parseFloat(averageRating)} readonly size="lg" />
                <span className="ms-3 h4 mb-0 text-warning">{averageRating}/5</span>
                <span className="ms-2 text-muted">({reviews.length} reviews)</span>
              </div>
              
              {reviews.length > 0 && (
                <RatingDistribution reviews={reviews} />
              )}
            </div>

            {credits && credits.cast && (
              <div>
                <strong>Cast: </strong>
                <span className="text-muted">
                  {credits.cast.slice(0, 5).map(person => person.name).join(', ')}
                  {credits.cast.length > 5 && '...'}
                </span>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Review Form Section */}
      <Row className="mb-4">
        <Col>
          <Card className="review-card">
            <Card.Header>
              <h5 className="mb-0 text-light">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmitReview}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Your Rating</Form.Label>
                  <div>
                    <StarRating 
                      rating={reviewForm.rating} 
                      onRatingChange={handleRatingChange}
                      size="lg"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Your Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Share your thoughts about this movie..."
                    required
                  />
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {editingReview ? 'Updating...' : 'Submitting...'}
                      </>
                    ) : (
                      editingReview ? 'Update Review' : 'Submit Review'
                    )}
                  </Button>
                  {editingReview && (
                    <Button variant="secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews List Section */}
      <Row>
        <Col>
          <h3 className="text-light mb-4">
            Community Reviews ({reviews.length})
          </h3>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {reviews.length === 0 ? (
            <Card className="review-card">
              <Card.Body className="text-center">
                <p className="text-light mb-0">No reviews yet. Be the first to review this movie!</p>
              </Card.Body>
            </Card>
          ) : (
            <ListGroup>
              {reviews.map(review => (
                <ListGroup.Item key={review.id} className="review-card mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0 text-light me-3">{review.userName}</h6>
                        <StarRating rating={review.rating} readonly size="sm" />
                        <small className="text-muted ms-2">
                          {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="text-light mb-0">{review.comment}</p>
                    </div>
                    
                    {/* In real app, show buttons only for user's own reviews */}
                    <div className="d-flex gap-2 ms-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetail;