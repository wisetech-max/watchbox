import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import MovieCard from "../Components/MovieCard";
import { tmdbAPI } from "../Services/Tmdb";

function Anime() {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    tmdbAPI.anime().then((data) => setAnime(data));
  }, []);

  return (
    <>
      <NavBar />

      <h1 className="text-3xl font-bold text-white p-6">Popular Anime</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
        {anime.map((animeItem) => (
          <MovieCard
            key={animeItem.id}
            movie={{
              ...animeItem,
              title: animeItem.name,
              releaseYear: animeItem.first_air_date?.split("-")[0],
            }}
          />
        ))}
      </div>
    </>
  );
}

export default Anime;
