import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies, onTitleClick }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-row">
      <h2 className="row-title" onClick={onTitleClick}>
        {title}
      </h2>
      
      <div className="row-container">
        {showLeftArrow && (
          <button 
            className="row-arrow row-arrow-left"
            onClick={() => scroll('left')}
          >
            <FaChevronLeft />
          </button>
        )}
        
        <div 
          className="row-movies" 
          ref={rowRef}
          onScroll={handleScroll}
        >
          {movies.map(movie => (
            <div key={movie.id} className="row-movie-item">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            className="row-arrow row-arrow-right"
            onClick={() => scroll('right')}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow; 