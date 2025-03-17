import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MoviePlayer from '../components/MoviePlayer';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Set body background to black when watching
  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="watch-page">
      <MoviePlayer movieId={id} />
    </div>
  );
};

export default Watch; 