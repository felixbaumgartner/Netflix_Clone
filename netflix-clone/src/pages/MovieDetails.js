import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaThumbsUp } from 'react-icons/fa';
import api from '../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await api.getMovieDetails(id);
        setMovie(movieData);
        
        const videosData = await api.getMovieVideos(id);
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  // Find trailer
  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube') || videos[0];
  
  // Format runtime
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="movie-details">
      {/* Backdrop */}
      <div 
        className="movie-backdrop" 
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%), 
                            url(${api.getImageUrl(movie.backdrop_path)})` 
        }}
      >
        <div className="movie-details-content">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta">
            <span className="movie-year">{movie.release_date?.substring(0, 4)}</span>
            {movie.runtime && <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>}
            <span className="movie-rating">{movie.vote_average?.toFixed(1)}</span>
          </div>
          
          <div className="movie-actions">
            <Link to={`/watch/${movie.id}`} className="netflix-btn">
              <FaPlay style={{ marginRight: '10px' }} /> Play
            </Link>
            <button className="netflix-btn netflix-btn-secondary">
              <FaPlus style={{ marginRight: '10px' }} /> My List
            </button>
            <button className="netflix-btn netflix-btn-secondary">
              <FaThumbsUp style={{ marginRight: '10px' }} /> Rate
            </button>
          </div>
          
          <div className="movie-overview">
            <p>{movie.overview}</p>
          </div>
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-genres">
              <span className="label">Genres: </span>
              {movie.genres.map((genre, index) => (
                <span key={genre.id || index}>
                  {genre.name || genre}
                  {index < movie.genres.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Trailer Section */}
      {trailer && (
        <div className="movie-trailer-section">
          <h2 className="section-title">Trailer</h2>
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails; 