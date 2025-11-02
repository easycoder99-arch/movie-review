import React from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  size = 'md',
  readonly = false,
  maxStars = 5 
}) => {
  const handleStarClick = (selectedRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''} ${size} ${readonly ? 'readonly' : 'clickable'}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => !readonly && document.querySelectorAll('.star').forEach((star, index) => {
            if (index < i) star.classList.add('hover');
          })}
          onMouseLeave={() => !readonly && document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('hover');
          })}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="star-rating">
      {renderStars()}
      {!readonly && (
        <span className="rating-text ms-2">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;