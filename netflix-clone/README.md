# Netflix Clone with Watch Party Feature

This project is a Netflix clone with a watch party feature that allows users to watch movies together in real-time.

## Features

### Watch Party

The Watch Party feature allows users to:

- Create a watch party and invite friends using a unique party code
- Chat with participants in real-time
- Synchronize video playback (play, pause, seek) across all participants
- See who's watching with you
- React with emojis during the movie
- Toggle microphone for voice chat (UI only in this version)

### How to Use Watch Party

1. Start watching any movie
2. Click the "Watch Party" button in the player controls
3. Share the generated party code with friends
4. Friends can join by entering the code in their Netflix clone app
5. All playback controls are synchronized between participants
6. Chat and react in real-time while watching

## Technical Implementation

The Watch Party feature is implemented using:

- WebSockets for real-time communication
- Custom event system for synchronizing video playback
- React for the UI components
- CSS for styling

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- TMDB API key (optional - sample data is provided if you don't have one)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/netflix-clone.git
cd netflix-clone
```

2. Install dependencies
```
npm install
```

3. (Optional) Add your TMDB API key
   - Get an API key from [The Movie Database](https://www.themoviedb.org/documentation/api)
   - Open `src/services/api.js` and replace `'YOUR_TMDB_API_KEY'` with your actual API key

4. Start the development server
```
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components for different routes
- `src/services`: API service for fetching movie data
- `src/assets`: Static assets like images

## Customization

- To change the styling, modify the CSS files in the respective component folders
- To add more features, extend the API service in `src/services/api.js`

## License

This project is for educational purposes only. All movie data is provided by The Movie Database (TMDB) API.

## Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Netflix](https://www.netflix.com/) for the design inspiration

## Future Improvements

- Add voice chat functionality
- Implement screen sharing
- Add more reaction options
- Create a mobile version of the watch party feature
- Add user authentication for watch parties 