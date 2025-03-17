import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCopy, FaUserPlus, FaComments, FaMicrophone, FaMicrophoneSlash, FaSmile } from 'react-icons/fa';
import watchPartyService from '../services/watchPartyService';
import './WatchParty.css';

// Main component
const WatchParty = ({ movieId, videoRef, isHost = true }) => {
  const [partyCode, setPartyCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 1, username: 'You (Host)', isHost: true, isSelf: true }
  ]);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  
  const chatContainerRef = useRef(null);
  const chatInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Common emojis for reactions
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🤔'];
  
  // Component did mount effect
  useEffect(() => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPartyCode(randomCode);
    
    // Initialize watch party connection
    initializeWatchParty(randomCode);
    
    // Hide participants list after a delay
    setTimeout(() => {
      setShowParticipants(false);
    }, 5000);
    
    return () => {
      // Clean up watch party connection on unmount
      watchPartyService.disconnect();
    };
  }, []);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Set up video event listeners
  useEffect(() => {
    if (videoRef && videoRef.current) {
      const player = videoRef.current.getInternalPlayer();
      
      if (player) {
        // Add event listeners to the video player
        player.addEventListener('play', handlePlay);
        player.addEventListener('pause', handlePause);
        player.addEventListener('seeked', handleSeek);
        
        return () => {
          // Remove event listeners when component unmounts
          player.removeEventListener('play', handlePlay);
          player.removeEventListener('pause', handlePause);
          player.removeEventListener('seeked', handleSeek);
        };
      }
    }
  }, [videoRef, isConnected]);
  
  // Initialize watch party
  const initializeWatchParty = (roomCode) => {
    console.log('Initializing watch party with code:', roomCode);
    
    // Set up event handlers
    watchPartyService.on('onUserJoined', handleUserJoined);
    watchPartyService.on('onUserLeft', handleUserLeft);
    watchPartyService.on('onPlaybackUpdate', handlePlaybackUpdate);
    watchPartyService.on('onChatMessage', handleChatMessage);
    watchPartyService.on('onReaction', handleReaction);
    watchPartyService.on('onConnectionChange', (connected) => {
      console.log('Connection status changed:', connected);
      setIsConnected(connected);
    });
    watchPartyService.on('onError', (error) => console.error('Watch party error:', error));
    
    // Connect to watch party
    const connected = watchPartyService.connect(roomCode, 'You (Host)', isHost);
    console.log('Connected to watch party:', connected);
    
    // Set connected state immediately to allow chat functionality
    setIsConnected(true);
    
    // Add welcome message
    setChatMessages([
      {
        id: `system-welcome`,
        type: 'system',
        content: `Welcome to the watch party! Share code ${roomCode} with friends to invite them.`,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Focus the chat input after a short delay
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 1000);
  };
  
  // Handle user joined event
  const handleUserJoined = (data) => {
    // Add user to participants list if they're not already in it
    if (!participants.some(p => p.username === data.username)) {
      setParticipants(prev => [
        ...prev,
        { id: data.userId, username: data.username, isHost: data.isHost, isSelf: false }
      ]);
      
      // Add system message to chat
      setChatMessages(prev => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          type: 'system',
          content: `${data.username} joined the watch party`,
          timestamp: data.timestamp
        }
      ]);
      
      // Hide participants list after 3 or more users have joined (including host)
      if (participants.length >= 2) {
        setTimeout(() => {
          setShowParticipants(false);
        }, 2000);
      }
    }
  };
  
  // Handle user left event
  const handleUserLeft = (data) => {
    // Remove user from participants list
    setParticipants(prev => prev.filter(p => p.id !== data.userId));
    
    // Add system message to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        type: 'system',
        content: `${data.username} left the watch party`,
        timestamp: data.timestamp
      }
    ]);
  };
  
  // Handle playback update event
  const handlePlaybackUpdate = (data) => {
    if (videoRef && videoRef.current) {
      const player = videoRef.current.getInternalPlayer();
      
      if (player) {
        // Update video playback state
        if (data.action === 'play') {
          player.play();
        } else if (data.action === 'pause') {
          player.pause();
        } else if (data.action === 'seek') {
          player.currentTime = data.currentTime;
        }
        
        // Add system message to chat
        setChatMessages(prev => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            type: 'system',
            content: `${data.username} ${data.action}ed the video`,
            timestamp: data.timestamp
          }
        ]);
      }
    }
  };
  
  // Handle chat message event
  const handleChatMessage = (data) => {
    console.log('Received chat message:', data);
    
    // Check if this message is from the current user
    const isSelfMessage = data.username === 'You (Host)';
    
    setChatMessages(prev => [
      ...prev,
      {
        id: data.messageId,
        type: 'message',
        sender: data.username,
        content: data.message,
        timestamp: data.timestamp,
        isSelf: isSelfMessage
      }
    ]);
  };
  
  // Handle reaction event
  const handleReaction = (data) => {
    // Show reaction animation
    setCurrentReaction({
      emoji: data.emoji,
      username: data.username,
      timestamp: Date.now()
    });
    
    // Hide reaction after 2 seconds
    setTimeout(() => {
      setCurrentReaction(null);
    }, 2000);
  };
  
  // Handle video playback events
  const handlePlay = () => {
    if (isConnected) {
      watchPartyService.sendPlaybackUpdate('play', videoRef.current.getCurrentTime());
    }
  };
  
  const handlePause = () => {
    if (isConnected) {
      watchPartyService.sendPlaybackUpdate('pause', videoRef.current.getCurrentTime());
    }
  };
  
  const handleSeek = () => {
    if (isConnected) {
      watchPartyService.sendPlaybackUpdate('seek', videoRef.current.getCurrentTime());
    }
  };
  
  // Handle chat input
  const handleChatSubmit = (e) => {
    e.preventDefault();
    console.log('Chat submit triggered');
    
    // Always allow sending messages even if connection status is uncertain
    if (messageInput.trim()) {
      try {
        console.log('Sending chat message:', messageInput);
        
        // Send the message through the service if connected
        if (isConnected) {
          watchPartyService.sendChatMessage(messageInput);
          // Don't add to local state here, as the service will trigger handleChatMessage
          // which will add the message to the chat
        } else {
          console.log('Not connected, but still adding message to local state');
          // Only add to local state directly if not connected
          setChatMessages(prev => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              type: 'message',
              sender: 'You (Host)',
              content: messageInput,
              timestamp: new Date().toISOString()
            }
          ]);
        }
        
        // Clear the input field
        setMessageInput('');
        
        // Force connection if not already connected
        if (!isConnected) {
          console.log('Attempting to reconnect...');
          const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          initializeWatchParty(randomCode);
        }
      } catch (error) {
        console.error('Error sending chat message:', error);
        alert('Failed to send message. Please try again.');
      }
    } else {
      console.log('Cannot send empty message');
    }
  };
  
  // Handle reaction click
  const handleReactionClick = (emoji) => {
    if (isConnected) {
      watchPartyService.sendReaction(emoji);
    }
    
    setShowEmojiPicker(false);
  };
  
  // Copy party code to clipboard
  const copyPartyCode = () => {
    navigator.clipboard.writeText(partyCode);
    alert(`Party code ${partyCode} copied to clipboard!`);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
    // In a real implementation, this would enable/disable the user's microphone
  };
  
  // Add a function to focus the chat input
  const focusChatInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };
  
  // Toggle participants list
  const toggleParticipants = (e) => {
    if (e) e.stopPropagation();
    setShowParticipants(!showParticipants);
  };
  
  return (
    <div 
      className="watch-party-container"
      onClick={(e) => {
        // Prevent clicks in the watch party container from affecting the video player
        e.stopPropagation();
      }}
    >
      {/* Party info bar */}
      <div 
        className="party-info-bar"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="party-info"
          onClick={(e) => e.stopPropagation()}
        >
          <FaUsers className="party-icon" />
          <span>Watch Party</span>
          <div className="party-code">
            <span>{partyCode}</span>
            <button 
              className="copy-button" 
              onClick={(e) => {
                e.stopPropagation();
                copyPartyCode();
              }}
            >
              <FaCopy />
            </button>
          </div>
        </div>
        <div className="party-controls">
          <button 
            className={`control-button ${showChat ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowChat(!showChat);
            }}
          >
            <FaComments />
          </button>
          <button 
            className={`control-button ${showParticipants ? 'active' : ''}`}
            onClick={toggleParticipants}
          >
            <FaUsers />
            <span className="participant-count">{participants.length}</span>
          </button>
          <button 
            className={`control-button ${micEnabled ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMicrophone();
            }}
          >
            {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button 
            className="control-button invite-button"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Invite your friends using code: ${partyCode}`);
            }}
          >
            <FaUserPlus />
            <span>Invite</span>
          </button>
        </div>
      </div>
      
      {/* Chat sidebar */}
      {showChat && (
        <div 
          className="chat-sidebar" 
          onClick={(e) => {
            // Prevent clicks in the chat sidebar from affecting the video player
            e.stopPropagation();
          }}
        >
          <div className="chat-sidebar-content">
            {showParticipants && (
              <div className="participants-section">
                <h3>Participants ({participants.length})</h3>
                <ul className="participants-list">
                  {participants.map(participant => (
                    <li key={participant.id} className="participant">
                      <span className={`participant-name ${participant.isHost ? 'host' : ''}`}>
                        {participant.username}
                        {participant.isHost && <span className="host-badge">Host</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={`chat-section ${!showParticipants ? 'full-height' : ''}`}>
              <h3>Chat</h3>
              <div 
                className="chat-messages" 
                ref={chatContainerRef}
                onClick={(e) => e.stopPropagation()}
              >
                {chatMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`chat-message ${message.type === 'system' ? 'system-message' : ''}`}
                  >
                    {message.type === 'message' && (
                      <div className="message-header">
                        <span className="message-sender">{message.sender}</span>
                        <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                      </div>
                    )}
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Chat input form - Always visible at the bottom */}
          <form 
            className="chat-input-form" 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleChatSubmit(e);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="chat-input-container"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => {
                  e.stopPropagation();
                  console.log('Input changed:', e.target.value);
                  setMessageInput(e.target.value);
                }}
                placeholder="Type a message..."
                className="chat-input"
                autoComplete="off"
                ref={chatInputRef}
                onClick={(e) => {
                  e.stopPropagation();
                  focusChatInput();
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  console.log('Key pressed:', e.key);
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e);
                  }
                }}
              />
              <button 
                type="button" 
                className="emoji-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              >
                <FaSmile />
              </button>
              {showEmojiPicker && (
                <div 
                  className="emoji-picker"
                  onClick={(e) => e.stopPropagation()}
                >
                  {commonEmojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className="emoji"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReactionClick(emoji);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              type="button" 
              className="send-button"
              onClick={(e) => {
                e.stopPropagation();
                handleChatSubmit(e);
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
      
      {/* Reaction display */}
      {currentReaction && (
        <div className="reaction-display">
          <div className="reaction-emoji">{currentReaction.emoji}</div>
          <div className="reaction-username">{currentReaction.username}</div>
        </div>
      )}
    </div>
  );
};

export default WatchParty; 