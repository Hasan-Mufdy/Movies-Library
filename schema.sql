DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    movieID SERIAL PRIMARY KEY,
    movieName VARCHAR(255),
    movieInfo VARCHAR(255)
);