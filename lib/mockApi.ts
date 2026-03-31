// Mock API handlers for questionnaire and manual recommendation modes
export const mockQuestionnaireRecommendation = async (data: {
  user_id: string;
  language: string;
  era: string;
  genres: string[];
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response based on selected genres
  const mockMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      year: "2008",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight",
      primary_genre: "Action",
      rating: 9.0,
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham Batman must accept one of the greatest psychological and physical tests.",
      language: "English"
    },
    {
      id: 2,
      title: "Inception",
      year: "2010",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception",
      primary_genre: "Sci-Fi",
      rating: 8.8,
      overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      language: "English"
    },
    {
      id: 3,
      title: "The Matrix",
      year: "1999",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Matrix",
      primary_genre: "Sci-Fi",
      rating: 8.7,
      overview: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
      language: "English"
    },
    {
      id: 4,
      title: "Mad Max: Fury Road",
      year: "2015",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Mad+Max",
      primary_genre: "Action",
      rating: 8.1,
      overview: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
      language: "English"
    },
    {
      id: 5,
      title: "Blade Runner 2049",
      year: "2017",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Blade+Runner",
      primary_genre: "Sci-Fi",
      rating: 8.0,
      overview: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
      language: "English"
    },
    {
      id: 6,
      title: "John Wick",
      year: "2014",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=John+Wick",
      primary_genre: "Action",
      rating: 7.4,
      overview: "An ex-hitman comes out of retirement to track down the gangsters that killed his dog and stole his car.",
      language: "English"
    },
    {
      id: 7,
      title: "Edge of Tomorrow",
      year: "2014",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Edge+Tomorrow",
      primary_genre: "Sci-Fi",
      rating: 7.9,
      overview: "A soldier fighting aliens gets to relive the same day over and over again, each time getting better at fighting and understanding the enemy.",
      language: "English"
    }
  ];

  // Filter movies based on selected genres
  const filteredMovies = mockMovies.filter(movie => 
    data.genres.some(genre => 
      movie.primary_genre.toLowerCase().includes(genre.toLowerCase()) ||
      (genre === 'sci-fi' && movie.primary_genre === 'Sci-Fi') ||
      (genre === 'action' && movie.primary_genre === 'Action')
    )
  );

  // Ensure we have at least some movies
  const finalMovies = filteredMovies.length > 0 ? filteredMovies : mockMovies.slice(0, 7);

  return {
    hero: finalMovies[0],
    primary: finalMovies.slice(1, 8),
    extended: mockMovies.slice(8, 30).length > 0 ? mockMovies.slice(8, 30) : finalMovies.slice(2, 22),
    explanation: `Because you selected ${data.genres.join(' and ')} genres, we found these thrilling movies that match your taste perfectly.`,
    confidence_score: 92
  };
};

export const mockManualRecommendation = async (data: {
  user_id: string;
  language: string;
  era: string;
  movie_ids: number[];
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response based on selected movies
  const mockMovies = [
    {
      id: 10,
      title: "The Prestige",
      year: "2006",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Prestige",
      primary_genre: "Mystery",
      rating: 8.5,
      overview: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
      language: "English"
    },
    {
      id: 11,
      title: "Interstellar",
      year: "2014",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar",
      primary_genre: "Sci-Fi",
      rating: 8.6,
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      language: "English"
    },
    {
      id: 12,
      title: "Django Unchained",
      year: "2012",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Django",
      primary_genre: "Drama",
      rating: 8.4,
      overview: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.",
      language: "English"
    },
    {
      id: 13,
      title: "The Departed",
      year: "2006",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Departed",
      primary_genre: "Crime",
      rating: 8.5,
      overview: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
      language: "English"
    },
    {
      id: 14,
      title: "Shutter Island",
      year: "2010",
      poster_url: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Shutter+Island",
      primary_genre: "Thriller",
      rating: 8.2,
      overview: "A U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.",
      language: "English"
    }
  ];

  return {
    hero: mockMovies[0],
    primary: mockMovies.slice(1, 8),
    extended: mockMovies.slice(8, 30).length > 0 ? mockMovies.slice(8, 30) : mockMovies.slice(2, 22),
    explanation: `Because you loved these movies, we found similar films that match your sophisticated taste in cinema.`,
    confidence_score: 89
  };
};
