import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import MovieCard from "../Components/MovieCard";
import { tmdbAPI } from "../Services/Tmdb";

function Tv() {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTVShows() {
      try {
        setLoading(true);
        setError("");

        const data = await tmdbAPI.popularTV();

        setTvShows(
          Array.isArray(data)
            ? data.map((show) => ({
                ...show,
                title: show.name,
                releaseYear: show.first_air_date?.split("-")[0],
              }))
            : [],
        );
      } catch (err) {
        console.error("Error fetching TV shows:", err);
        setError("Failed to load TV shows. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTVShows();
  }, []);

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-base-100">
        <h1 className="text-3xl font-bold text-white p-6">Popular TV Shows</h1>

        {loading && <p className="text-white p-6">Loading TV shows...</p>}

        {error && <p className="text-red-500 p-6">{error}</p>}

        {!loading && !error && tvShows.length === 0 && (
          <p className="text-white p-6">No TV shows found.</p>
        )}

        {!loading && !error && tvShows.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
            {tvShows.map((tvShow) => (
              <MovieCard key={tvShow.id} movie={tvShow} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Tv;
