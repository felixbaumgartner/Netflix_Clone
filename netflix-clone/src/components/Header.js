import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <span>NETFLIX</span>
          </Link>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/tv-shows">TV Shows</Link></li>
              <li><Link to="/my-list">My List</Link></li>
            </ul>
          </nav>
        </div>

        <div className="header-right">
          <div className={`search-container ${showSearch ? 'active' : ''}`}>
            <form onSubmit={handleSearchSubmit}>
              <button 
                type="button" 
                className="search-icon-btn"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch />
              </button>
              {showSearch && (
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              )}
            </form>
          </div>
          <div className="notifications">
            <FaBell />
          </div>
          <div className="profile">
            <img 
              src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4" 
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 