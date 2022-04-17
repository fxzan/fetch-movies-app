import React from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovies from "./components/AddMovies";

function App() {
  const [movies, setMovies] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [retry, setRetry] = React.useState(false);
  const [init, setInit] = React.useState(true);

  const fetchMoviesHandler = React.useCallback(async () => {
    console.log("Fetching Movies");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-movie-ee774-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );

      if (!response.ok) {
        setRetry(true);
        throw new Error(
          "Something Went Wrong! (Error: " + response.status + ")"
        );
      }

      const data = await response.json();

      const loadedMovies = [];

      for (let key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (init) {
      setInit(false);
      fetchMoviesHandler();
    }

    if (retry) {
      var timer = setTimeout(() => {
        console.log("Retry");
        fetchMoviesHandler();
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [init, retry, error, fetchMoviesHandler]);

  function cancelRetry() {
    setRetry(false);
  }

  async function addMovieHandler(movie) {
    try {
      const response = await fetch(
        "https://react-movie-ee774-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Something Went Wrong! (Error: " + response.status + ")"
        );
      }

      const data = await response.json();
      console.log(data);
      fetchMoviesHandler();
    } catch (error) {
      setError(error);
    }
  }

  async function deleteMovieHandler(id) {
      const response = await fetch(
        `https://react-movie-ee774-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
    console.log(response);
    
      fetchMoviesHandler();
  }

  let content = <p>Found no movies.</p>;

  if (isLoading) content = <p>Loading...</p>;

  if (error) content = <p>{error}</p>;

  if (error && retry)
    content = (
      <>
        <p>{error}</p>
        <div>Retrying...</div>
        <button onClick={cancelRetry}>Cancel</button>
      </>
    );

  if (!isLoading && movies.length > 0) content = <MoviesList movies={movies} onDelete={deleteMovieHandler}/>;

  return (
    <React.Fragment>
      <section>
        <AddMovies onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
