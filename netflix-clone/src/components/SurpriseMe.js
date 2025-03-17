import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRandom, FaPlay, FaInfoCircle, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import './SurpriseMe.css';

const SurpriseMe = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);
    try {
      // Get AI recommendation
      const recommendedMovie = await api.getAIRecommendation();
      
      // Get more details about the movie
      const movieDetails = await api.getMovieDetails(recommendedMovie.id);
      
      setRecommendation(movieDetails);
      setShowModal(true);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="surprise-me-container">
      <button 
        className="surprise-me-button"
        onClick={getRecommendation}
        disabled={loading}
      >
        <FaRandom className="surprise-icon" />
        <span>{loading ? 'Finding the perfect movie...' : 'Surprise Me'}</span>
      </button>
      
      {showModal && recommendation && (
        <div className="recommendation-modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-header">
              <h2>Your AI Recommendation</h2>
              <p className="recommendation-tagline">Based on your viewing preferences</p>
            </div>
            
            <div className="recommendation-content">
              <div 
                className="recommendation-backdrop"
                style={{ 
                  backgroundImage: `url(${api.getImageUrl(recommendation.backdrop_path, 'w1280')})` 
                }}
              >
                <div className="recommendation-poster">
                  <img 
                    src={api.getImageUrl(recommendation.poster_path, 'w342')} 
                    alt={recommendation.title} 
                  />
                </div>
              </div>
              
              <div className="recommendation-details">
                <h3>{recommendation.title}</h3>
                
                <div className="recommendation-meta">
                  <span className="recommendation-year">
                    {recommendation.release_date?.substring(0, 4)}
                  </span>
                  <span className="recommendation-rating">
                    {recommendation.vote_average?.toFixed(1)}
                  </span>
                  {recommendation.runtime && (
                    <span className="recommendation-runtime">
                      {Math.floor(recommendation.runtime / 60)}h {recommendation.runtime % 60}m
                    </span>
                  )}
                </div>
                
                <p className="recommendation-overview">{recommendation.overview}</p>
                
                <div className="recommendation-reason">
                  <h4>Why we think you'll like it:</h4>
                  <p>This title matches your preference for {recommendation.genres?.map(g => g.name).join(', ')} content and has been enjoyed by viewers with similar tastes.</p>
                </div>
                
                <div className="recommendation-actions">
                  <Link to={`/watch/${recommendation.id}`} className="netflix-btn">
                    <FaPlay style={{ marginRight: '10px' }} /> Play
                  </Link>
                  <Link to={`/movie/${recommendation.id}`} className="netflix-btn netflix-btn-secondary">
                    <FaInfoCircle style={{ marginRight: '10px' }} /> More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurpriseMe; 