import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaUsers } from 'react-icons/fa';
import WatchParty from './WatchParty';
import './MoviePlayer.css';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showWatchParty, setShowWatchParty] = useState(false);
  
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // In a real app, this would fetch from an API
        // For now, we'll simulate with a timeout
        setTimeout(() => {
          setMovie({
            id,
            title: 'Sample Movie',
            description: 'This is a sample movie for the Netflix clone.',
            videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', // Sample video URL
            thumbnailUrl: 'https://via.placeholder.com/1280x720',
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setLoading(false);
      }
    };
    
    fetchMovie();
    
    // Add event listener for keyboard controls
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [id]);
  
  // Handle keyboard controls
  const handleKeyDown = (e) => {
    switch (e.key.toLowerCase()) {
      case ' ':
        togglePlay();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'm':
        toggleMute();
        break;
      case 'arrowleft':
        seekBackward();
        break;
      case 'arrowright':
        seekForward();
        break;
      case 'escape':
        if (fullscreen) {
          toggleFullscreen();
        }
        break;
      default:
        break;
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setPlaying(!playing);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };
  
  // Seek backward 10 seconds
  const seekBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };
  
  // Seek forward 10 seconds
  const seekForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.min(currentTime + 10, duration));
    }
  };
  
  // Handle mouse movement to show/hide controls
  const handleMouseMove = (e) => {
    // Check if the event originated from the watch party component
    if (e.target.closest('.watch-party-container')) {
      // Don't toggle controls if the user is interacting with the watch party
      return;
    }
    
    setShowControls(true);
    
    clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Handle progress update
  const handleProgress = (state) => {
    setProgress(state.played);
  };
  
  // Handle duration update
  const handleDuration = (duration) => {
    setDuration(duration);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    
    return `${mm}:${ss}`;
  };
  
  // Handle seek on progress bar click
  const handleSeekChange = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    playerRef.current.seekTo(percent);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };
  
  // Toggle watch party
  const toggleWatchParty = () => {
    setShowWatchParty(!showWatchParty);
    // If we're showing the watch party, make sure controls stay visible
    if (!showWatchParty) {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  };
  
  // Go back to browse page
  const goBack = () => {
    navigate('/browse');
  };
  
  if (loading) {
    return (
      <div className="movie-player-loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div 
      className={`movie-player-container ${fullscreen ? 'fullscreen' : ''}`}
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
    >
      <ReactPlayer
        ref={playerRef}
        url={movie.videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        className="react-player"
      />
      
      {showControls && (
        <div className="player-controls">
          <div className="top-controls">
            <button className="back-button" onClick={goBack}>
              <FaArrowLeft />
            </button>
            <h2 className="movie-title">{movie.title}</h2>
            <button 
              className={`watch-party-button ${showWatchParty ? 'active' : ''}`}
              onClick={toggleWatchParty}
            >
              <FaUsers />
              <span>Watch Party</span>
            </button>
          </div>
          
          <div className="center-controls">
            <button className="seek-button" onClick={seekBackward}>-10s</button>
            <button className="play-pause-button" onClick={togglePlay}>
              {playing ? <FaPause /> : <FaPlay />}
            </button>
            <button className="seek-button" onClick={seekForward}>+10s</button>
          </div>
          
          <div className="bottom-controls">
            <div className="progress-container" onClick={handleSeekChange}>
              <div className="progress-bar">
                <div 
                  className="progress-filled" 
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
              <div className="time-display">
                <span>{formatTime(duration * progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="volume-container">
              <button className="volume-button" onClick={toggleMute}>
                <FaVolumeUp />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            
            <button className="fullscreen-button" onClick={toggleFullscreen}>
              {fullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      )}
      
      {showWatchParty && (
        <WatchParty 
          movieId={id} 
          videoRef={playerRef} 
          isHost={true}
        />
      )}
    </div>
  );
};

export default MoviePlayer; 