import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import api from '../services/api';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const posterUrl = api.getImageUrl(movie.poster_path, 'w500');
  const fallbackPosterUrl = 'https://via.placeholder.com/500x750/141414/e50914?text=No+Image';

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={posterUrl || fallbackPosterUrl} 
          alt={movie.title} 
          className="movie-poster"
        />
        <div className="movie-card-overlay">
          <div className="movie-card-buttons">
            <Link to={`/watch/${movie.id}`} className="card-btn play-btn">
              <FaPlay />
            </Link>
            <Link to={`/movie/${movie.id}`} className="card-btn info-btn">
              <FaInfoCircle />
            </Link>
          </div>
          <div className="movie-card-info">
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-meta">
              <span className="movie-rating">{movie.vote_average.toFixed(1)}</span>
              <span className="movie-year">{movie.release_date?.substring(0, 4)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard; 