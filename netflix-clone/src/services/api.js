import axios from 'axios';

// We'll use The Movie Database (TMDB) API
const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// For demo purposes, if you don't have an API key, we'll use this sample data
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    release_date: '2010-07-16',
    vote_average: 8.4,
    genres: ['Action', 'Science Fiction', 'Adventure'],
    genre_ids: [28, 878, 12]
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    release_date: '1994-09-23',
    vote_average: 8.7,
    genres: ['Drama', 'Crime'],
    genre_ids: [18, 80]
  },
  {
    id: 3,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    release_date: '2008-07-16',
    vote_average: 8.5,
    genres: ['Drama', 'Action', 'Crime', 'Thriller'],
    genre_ids: [18, 28, 80, 53]
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-09-10',
    vote_average: 8.5,
    genres: ['Thriller', 'Crime'],
    genre_ids: [53, 80]
  },
  {
    id: 5,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    genres: ['Drama'],
    genre_ids: [18]
  },
  {
    id: 6,
    title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdrop_path: '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
    release_date: '1994-06-23',
    vote_average: 8.5,
    genres: ['Comedy', 'Drama', 'Romance'],
    genre_ids: [35, 18, 10749]
  }
];

// Sample genres
const SAMPLE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

// Sample user preferences (in a real app, this would come from user data)
const USER_PREFERENCES = {
  favoriteGenres: [28, 878, 53], // Action, Sci-Fi, Thriller
  minRating: 7.5,
  recentlyWatched: [1, 3] // IDs of recently watched movies
};

// API functions
const api = {
  // Get trending movies
  getTrending: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return SAMPLE_MOVIES;
    }
  },

  // Search for movies
  searchMovies: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return SAMPLE_MOVIES.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Get movie details
  getMovieDetails: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return SAMPLE_MOVIES.find(movie => movie.id === parseInt(id)) || SAMPLE_MOVIES[0];
    }
  },

  // Get movie videos (trailers, etc.)
  getMovieVideos: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [{ key: 'dQw4w9WgXcQ', site: 'YouTube', type: 'Trailer' }]; // Sample YouTube video
    }
  },

  // Get all genres
  getGenres: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return SAMPLE_GENRES;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId) => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return SAMPLE_MOVIES.filter(movie => 
        movie.genre_ids.includes(parseInt(genreId))
      );
    }
  },

  // Get AI recommendation
  getAIRecommendation: async () => {
    try {
      // In a real app, this would call an AI recommendation endpoint
      // For now, we'll simulate it by getting movies that match user preferences
      
      // First try to get recommendations from TMDB API
      try {
        // Get a random movie from user's recently watched to base recommendations on
        const recentMovieId = USER_PREFERENCES.recentlyWatched[
          Math.floor(Math.random() * USER_PREFERENCES.recentlyWatched.length)
        ];
        
        const response = await axios.get(
          `${BASE_URL}/movie/${recentMovieId}/recommendations?api_key=${API_KEY}`
        );
        
        // Filter by minimum rating
        const filteredResults = response.data.results.filter(
          movie => movie.vote_average >= USER_PREFERENCES.minRating
        );
        
        if (filteredResults.length > 0) {
          // Return a random movie from filtered results
          return filteredResults[Math.floor(Math.random() * filteredResults.length)];
        }
      } catch (error) {
        console.error('Error fetching recommendations from API:', error);
      }
      
      // Fallback to sample data if API call fails
      // Filter sample movies by user preferences
      const matchingMovies = SAMPLE_MOVIES.filter(movie => {
        // Check if movie has at least one of user's favorite genres
        const hasMatchingGenre = movie.genre_ids.some(
          genreId => USER_PREFERENCES.favoriteGenres.includes(genreId)
        );
        
        // Check if movie meets minimum rating
        const meetsRating = movie.vote_average >= USER_PREFERENCES.minRating;
        
        // Check if movie is not recently watched
        const notRecentlyWatched = !USER_PREFERENCES.recentlyWatched.includes(movie.id);
        
        return hasMatchingGenre && meetsRating && notRecentlyWatched;
      });
      
      // Return a random movie from matching movies
      return matchingMovies[Math.floor(Math.random() * matchingMovies.length)];
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      // Return a random sample movie as fallback
      return SAMPLE_MOVIES[Math.floor(Math.random() * SAMPLE_MOVIES.length)];
    }
  },

  // Helper function to get image URL
  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

export default api; 