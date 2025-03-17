import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import SurpriseMe from '../components/SurpriseMe';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await api.getTrending();
        setTrendingMovies(movies);
        
        // Set a random movie as featured
        const randomIndex = Math.floor(Math.random() * movies.length);
        setFeaturedMovie(movies[randomIndex]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      {/* Featured Movie Hero Section */}
      {featuredMovie && (
        <div 
          className="hero" 
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)), 
                              url(${api.getImageUrl(featuredMovie.backdrop_path)})` 
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.overview}</p>
            <div className="hero-buttons">
              <Link to={`/watch/${featuredMovie.id}`} className="netflix-btn">
                <FaPlay style={{ marginRight: '10px' }} /> Play
              </Link>
              <Link to={`/movie/${featuredMovie.id}`} className="netflix-btn netflix-btn-secondary">
                <FaInfoCircle style={{ marginRight: '10px' }} /> More Info
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Surprise Me Section */}
      <div className="surprise-me-section">
        <div className="container">
          <div className="surprise-me-wrapper">
            <div className="surprise-me-info">
              <h2>Not sure what to watch?</h2>
              <p>Let our AI recommend the perfect movie for you based on your viewing history and preferences.</p>
            </div>
            <SurpriseMe />
          </div>
        </div>
      </div>

      {/* Trending Movies Section */}
      <section className="movie-section">
        <h2 className="section-title">Trending Now</h2>
        <div className="movie-grid">
          {trendingMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 