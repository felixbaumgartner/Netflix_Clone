import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import api from '../services/api';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        setLoading(true);
        try {
          const results = await api.searchMovies(query);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching movies:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setLoading(false);
      }
    };

    fetchSearchResults();
    setSearchQuery(query);
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const results = await api.searchMovies(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
      
      // Update URL without reloading the page
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : (
          <>
            {query && (
              <h2 className="results-title">
                {searchResults.length > 0 
                  ? `Search results for "${query}"`
                  : `No results found for "${query}"`}
              </h2>
            )}
            
            {searchResults.length > 0 ? (
              <div className="movie-grid">
                {searchResults.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : !loading && query && (
              <div className="no-results">
                <p>No movies found matching your search.</p>
                <p>Try different keywords or check your spelling.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search; 