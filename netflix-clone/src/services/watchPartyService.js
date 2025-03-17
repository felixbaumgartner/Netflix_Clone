// Mock WebSocket implementation for the Watch Party feature
// In a real application, this would connect to a real WebSocket server

class WatchPartyService {
  constructor() {
    this.socket = null;
    this.roomCode = null;
    this.username = null;
    this.callbacks = {
      onUserJoined: null,
      onUserLeft: null,
      onPlaybackUpdate: null,
      onChatMessage: null,
      onReaction: null,
      onConnectionChange: null,
      onError: null
    };
    
    // Mock participants for demo
    this.mockParticipants = [
      { id: 'user1', username: 'Alex', isHost: false },
      { id: 'user2', username: 'Jordan', isHost: false },
      { id: 'user3', username: 'Taylor', isHost: false }
    ];
  }
  
  // Initialize connection
  connect(roomCode, username, isHost = false) {
    this.roomCode = roomCode;
    this.username = username;
    
    // Simulate connection delay
    setTimeout(() => {
      console.log(`Connected to watch party room: ${roomCode}`);
      
      if (this.callbacks.onConnectionChange) {
        this.callbacks.onConnectionChange(true);
      }
      
      // Simulate other users joining after a delay
      this._simulateUserJoins();
    }, 1000);
    
    return true;
  }
  
  // Disconnect
  disconnect() {
    console.log('Disconnected from watch party');
    
    if (this.callbacks.onConnectionChange) {
      this.callbacks.onConnectionChange(false);
    }
    
    this.roomCode = null;
    this.username = null;
  }
  
  // Send playback update
  sendPlaybackUpdate(action, currentTime) {
    console.log(`Sending playback update: ${action} at ${currentTime}`);
    
    // Simulate other users receiving the update
    setTimeout(() => {
      if (this.callbacks.onPlaybackUpdate) {
        this.callbacks.onPlaybackUpdate({
          username: this.username,
          action,
          currentTime,
          timestamp: new Date().toISOString()
        });
      }
    }, 300);
  }
  
  // Send chat message
  sendChatMessage(message) {
    console.log(`Sending chat message: ${message}`);
    
    if (!message || !message.trim()) {
      console.error('Cannot send empty message');
      return false;
    }
    
    try {
      const messageId = `msg-${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      // Simulate message being sent and received
      setTimeout(() => {
        if (this.callbacks.onChatMessage) {
          this.callbacks.onChatMessage({
            messageId,
            username: this.username,
            message,
            timestamp
          });
        }
        
        // Simulate another user responding
        this._simulateUserResponse(message);
      }, 300);
      
      return true;
    } catch (error) {
      console.error('Error in sendChatMessage:', error);
      return false;
    }
  }
  
  // Send reaction
  sendReaction(emoji) {
    console.log(`Sending reaction: ${emoji}`);
    
    // Simulate reaction being sent and received
    setTimeout(() => {
      if (this.callbacks.onReaction) {
        this.callbacks.onReaction({
          username: this.username,
          emoji,
          timestamp: new Date().toISOString()
        });
      }
    }, 300);
  }
  
  // Set callback functions
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    } else {
      console.error(`Unknown event: ${event}`);
    }
  }
  
  // Private methods for simulation
  
  // Simulate other users joining
  _simulateUserJoins() {
    // Get all mock participants to join
    const allUsers = this._getRandomUsers(this.mockParticipants.length);
    
    // Make them join with a staggered delay
    allUsers.forEach((user, index) => {
      setTimeout(() => {
        if (this.callbacks.onUserJoined) {
          this.callbacks.onUserJoined({
            userId: user.id,
            username: user.username,
            isHost: user.isHost,
            timestamp: new Date().toISOString()
          });
        }
      }, 1500 + (index * 1500)); // Stagger joins every 1.5 seconds
    });
  }
  
  // Simulate user responses to chat
  _simulateUserResponse(originalMessage) {
    // Only respond sometimes
    if (Math.random() > 0.7) {
      return;
    }
    
    const randomUser = this._getRandomUsers(1)[0];
    const responses = [
      "Haha, that's funny!",
      "I agree!",
      "Wait, what's happening now?",
      "This part is so good!",
      "I can't believe this scene!",
      "Did you see that?",
      "Classic moment right here",
      "I love this movie!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
      if (this.callbacks.onChatMessage) {
        this.callbacks.onChatMessage({
          messageId: `msg-${Date.now()}`,
          username: randomUser.username,
          message: randomResponse,
          timestamp: new Date().toISOString()
        });
      }
    }, 3000 + (Math.random() * 5000));
    
    // Sometimes send a reaction too
    if (Math.random() > 0.5) {
      const emojis = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🤔'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      setTimeout(() => {
        if (this.callbacks.onReaction) {
          this.callbacks.onReaction({
            username: randomUser.username,
            emoji: randomEmoji,
            timestamp: new Date().toISOString()
          });
        }
      }, 2000 + (Math.random() * 3000));
    }
  }
  
  // Get random users from the mock participants
  _getRandomUsers(count) {
    const shuffled = [...this.mockParticipants].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// Create an instance of the service
const watchPartyServiceInstance = new WatchPartyService();

// Export the instance
export default watchPartyServiceInstance; 