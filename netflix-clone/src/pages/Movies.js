import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaThList, FaThLarge } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import api from '../services/api';
import './Movies.css';

const Movies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  // Get genre from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreId = params.get('genre');
    
    if (genreId) {
      const genre = genres.find(g => g.id.toString() === genreId);
      setSelectedGenre(genre || null);
    } else {
      setSelectedGenre(null);
    }
  }, [location.search, genres]);

  // Fetch genres and movies
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch genres
        const genresData = await api.getGenres();
        setGenres(genresData);
        
        // Fetch movies by genre or all movies
        if (selectedGenre) {
          const moviesByGenre = await api.getMoviesByGenre(selectedGenre.id);
          setMovies(moviesByGenre);
        } else {
          // Fetch movies for each genre to create rows
          const allGenreMovies = {};
          
          for (const genre of genresData) {
            const genreMovies = await api.getMoviesByGenre(genre.id);
            if (genreMovies.length > 0) {
              allGenreMovies[genre.id] = {
                genre: genre,
                movies: genreMovies
              };
            }
          }
          
          setMovies(allGenreMovies);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenre]);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setShowGenreDropdown(false);
    
    // Update URL
    if (genre) {
      navigate(`/movies?genre=${genre.id}`);
    } else {
      navigate('/movies');
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>Movies</h1>
        
        <div className="movies-controls">
          <div className="genre-dropdown">
            <button 
              className="genre-dropdown-btn"
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
            >
              <span>Genres</span>
              <FaChevronDown />
            </button>
            
            {showGenreDropdown && (
              <div className="genre-dropdown-content">
                <div 
                  className="genre-option"
                  onClick={() => handleGenreSelect(null)}
                >
                  All Genres
                </div>
                {genres.map(genre => (
                  <div 
                    key={genre.id}
                    className="genre-option"
                    onClick={() => handleGenreSelect(genre)}
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FaThList />
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaThLarge />
            </button>
          </div>
        </div>
      </div>
      
      <div className="movies-content">
        {selectedGenre ? (
          // Show movies for selected genre in grid or list view
          <>
            <h2 className="genre-title">{selectedGenre.name} Movies</h2>
            <div className={`movies-${viewMode}`}>
              {movies.length > 0 ? (
                movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                <p className="no-movies">No movies found for this genre.</p>
              )}
            </div>
          </>
        ) : (
          // Show all genres with horizontal rows
          <div className="genre-rows">
            {Object.values(movies).map(({ genre, movies }) => (
              <MovieRow 
                key={genre.id} 
                title={genre.name} 
                movies={movies}
                onTitleClick={() => handleGenreSelect(genre)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies; 