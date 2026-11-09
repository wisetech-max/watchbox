import { useEffect, useState } from "react";
import { getMovieTrailer } from "../Services/Tmdb";

function Trailer({ movieId, mediaType = "movie" }) {
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        setLoading(true);
        setTrailer(null);

        const trailerVideo = await getMovieTrailer(movieId, mediaType);

        setTrailer(trailerVideo);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      fetchTrailer();
    }
  }, [movieId, mediaType]);

  if (loading) {
    return <p className="text-white">Loading trailer...</p>;
  }

  if (!trailer) {
    return <p className="text-white">Trailer not available.</p>;
  }

  return (
    <iframe
      className="w-full aspect-video rounded-xl"
      src={`https://www.youtube.com/embed/${trailer.key}`}
      title={trailer.name}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

export default Trailer;
