import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { imageURL } from "../Services/Tmdb";
import { addToWatchlist, isInWatchlist } from "../Services/Watchlist";
import Trailer from "../Components/Trailer";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mediaType = searchParams.get("type") || "movie";

  const [movie, setMovie] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  // update the state once movie loads
  useEffect(() => {
    if (movie) setInWatchlist(isInWatchlist(movie.id));
  }, [movie]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setMovie(null);

        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

        const endpoint = mediaType === "tv" ? "tv" : "movie";

        const response = await fetch(
          `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${API_KEY}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();

        setMovie({
          ...data,

          // Normalize movie and TV show properties
          title: data.title || data.name,

          release_date: data.release_date || data.first_air_date,

          runtime: data.runtime || data.episode_run_time?.[0] || null,
        });

        document.title = `${data.title || data.name} | WatchBox`;

        const metaDescription = document.querySelector(
          'meta[name="description"]',
        );

        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            data.overview || "Watch movies and TV shows on WatchBox",
          );
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    }

    fetchMovie();
  }, [id, mediaType]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white text-2xl">
        Loading Movie...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* BACKDROP SECTION */}
      <div className="relative w-full min-h-screen">
        {/* Background Image */}
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : "https://placehold.co/1200x700?text=No+Image"
          }
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/90 to-black/40" />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-end">
            {/* BACK BUTTON */}
            <div className="w-full mb-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-white/10 hover:bg-red-600 transition px-5 py-3 rounded-xl border border-white/10 text-sm sm:text-base font-semibold backdrop-blur-md"
              >
                ← Back
              </button>
            </div>
            {/* POSTER */}
            <div className="shrink-0">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                    : "https://placehold.co/500x750?text=No+Poster"
                }
                alt={movie.title}
                className="w-60 sm:w-72 md:w-80 rounded-3xl shadow-2xl border border-white/10"
              />
            </div>

            {/* DETAILS */}
            <div className="w-full max-w-4xl text-center lg:text-left">
              {/* TITLE */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
                {movie.title}
              </h1>

              {/* TAGLINE */}
              {movie.tagline && (
                <p className="text-gray-300 italic text-lg sm:text-xl mb-6">
                  {movie.tagline}
                </p>
              )}

              {/* STATS */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl">
                  ⭐ {movie.vote_average?.toFixed(1)} Rating
                </div>

                <div className="bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-xl">
                  📅 {movie.release_date}
                </div>

                <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-xl">
                  ⏱️ {movie.runtime} mins
                </div>
              </div>

              {/* GENRES */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm hover:bg-red-500 transition"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* OVERVIEW */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>

                <p className="text-gray-300 leading-7 sm:leading-8 text-base sm:text-lg">
                  {movie.overview}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-600 hover:bg-red-700 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold transition shadow-lg"
                >
                  ▶ Watch Trailer
                </button>

                <button
                  onClick={() => {
                    addToWatchlist(movie);
                    setInWatchlist(true);
                  }}
                  disabled={inWatchlist}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold transition border border-white/10 ${
                    inWatchlist
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {inWatchlist ? "✓ Added to Watchlist" : "+ Add To Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXTRA INFO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BUDGET */}
          <div className="bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-3">Budget</h3>

            <p className="text-gray-300 text-lg wrap-break-word">
              ${movie.budget ? movie.budget.toLocaleString() : "Not Available"}
            </p>
          </div>

          {/* REVENUE */}
          <div className="bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-3">Revenue</h3>

            <p className="text-gray-300 text-lg wrap-break-word">
              $
              {movie.revenue ? movie.revenue.toLocaleString() : "Not Available"}
            </p>
          </div>

          {/* LANGUAGE */}
          <div className="bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-3">Language</h3>

            <p className="text-gray-300 text-lg">
              {movie.original_language?.toUpperCase()}
            </p>
          </div>
        </div>
      </section>
      {/* TRAILER MODAL */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-red-500"
            >
              ✕
            </button>

            <Trailer movieId={movie.id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
