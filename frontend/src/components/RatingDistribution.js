import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import './RatingDistribution.css';

const RatingDistribution = ({ reviews }) => {
  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const getPercentage = (count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const getVariant = (rating) => {
    switch (rating) {
      case 5: return 'success';
      case 4: return 'primary';
      case 3: return 'warning';
      case 2: return 'orange';
      case 1: return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="rating-distribution">
      <div className="d-flex align-items-center mb-3">
        <div className="average-rating me-4 text-center">
          <div className="display-4 fw-bold text-warning">{averageRating}</div>
          <div className="text-muted">out of 5</div>
          <div className="small text-muted">{totalReviews} reviews</div>
        </div>
        
        <div className="distribution-bars flex-grow-1">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="distribution-row d-flex align-items-center mb-2">
              <div className="rating-label me-2" style={{ width: '30px' }}>
                <span className="text-warning">{rating}★</span>
              </div>
              <div className="progress-container flex-grow-1">
                <ProgressBar 
                  now={getPercentage(distribution[rating])} 
                  variant={getVariant(rating)}
                  className="distribution-progress"
                />
              </div>
              <div className="count-label ms-2" style={{ width: '40px' }}>
                <small className="text-muted">{distribution[rating]}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingDistribution;