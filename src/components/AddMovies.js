import React from "react";
import "./AddMovies.css";

function AddMovies(props) {
  const [titleValue, setTitleValue] = React.useState("");
  const [dateValue, setDateValue] = React.useState("");
  const [textValue, setTextValue] = React.useState("");
  const [isValid, setIsValid] = React.useState(true);

  function addMovieHandler(event) {
    event.preventDefault();
    if (
      titleValue.trim().length === 0 ||
      dateValue.trim().length === 0 ||
      textValue.trim().length === 0
    ) {
      setIsValid(false);
      return;
    }
    props.onAddMovie({
      title: titleValue,
      openingText: textValue,
      releaseDate: dateValue,
    });
      setTitleValue("");
      setDateValue("");
      setTextValue("");
      setIsValid(true);
  }

  function titleHandler(event) {
    setTitleValue(event.target.value);
  }

  function dateHandler(event) {
    setDateValue(event.target.value);
  }

  function textHandler(event) {
    setTextValue(event.target.value);
  }

  return (
    <form onSubmit={addMovieHandler}>
      <label htmlFor="form-title">Title</label>
      <input
        id="form-title"
        type="text"
        value={titleValue}
        onChange={titleHandler}
      />
      <label htmlFor="form-title">Release Date</label>
      <input
        id="form-date"
        type="date"
        value={dateValue}
        onChange={dateHandler}
      />
      <label htmlFor="form-text">Opening Text</label>
      <textarea
        id="form-text"
        type="text"
        value={textValue}
        onChange={textHandler}
      />
      {!isValid && <h3>Please fill in all the fields.</h3>}
      <button type="submit">Add Movie</button>
    </form>
  );
}

export default AddMovies;
