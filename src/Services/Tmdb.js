import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Fetch 100 movies (30 pages × 10 movies)
async function fetchMovies(endpoint, pages = 100) {
  try {
    if (!API_KEY) {
      throw new Error("TMDb API key is missing. Check your .env file.");
    }

    // const requests = Array.from({ length: pages }, (_, index) =>
    //   api.get(endpoint, {
    //     params: {
    //       api_key: API_KEY,
    //       page: index + 1,
    //     },
    //   }),
    // );

    const requests = Array.from({ length: pages }, (_, index) =>
      api.get(endpoint, {
        params: {
          api_key: API_KEY,
          page: index + 1,
        },
      }),
    );

    const responses = await Promise.all(requests);
    return responses.flatMap((res) => res.data.results);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// TMDb API endpoints
export const tmdbAPI = {
  popularTV: () => fetchMovies("/tv/popular"),

  trending: () => fetchMovies("/trending/movie/week"),

  anime: () =>
    fetchMovies(
      "/discover/tv?with_genres=16&with_origin_country=JP&sort_by=popularity.desc",
    ),

  popular: () => fetchMovies("/movie/popular"),

  nowPlaying: () => fetchMovies("/movie/now_playing"),
};

// Fetch movie trailers
export const getMovieTrailer = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
      },
    });

    return response.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube",
    );
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    throw error;
  }
};

// Search movies
export const searchMovies = async (query) => {
  try {
    const response = await api.get("/search/movie", {
      params: {
        query,
      },
    });

    return response.data.results ?? [];
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// TMDb image URL
export const imageURL = "https://image.tmdb.org/t/p/w500";
