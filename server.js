'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config();
const pg = require('pg');

server.use(cors());
const PORT = 3000;
const apiKey = process.env.APIkey;
server.use(express.json());
let axios = require('axios');
const fs = require('fs');
const { send } = require('process');
const { error } = require('console');

const client = new pg.Client('postgresql://localhost:5432/movies');

//////
server.get('/trending', trendingHandler);
server.get('/search/:movieName', searchHandler); //here we can put a movie name in the url to search for it
           //*** the link for the search will be: /search/movie name
           // for example: /search/The Simpsons Meet the Bocellis in Feliz Navidad

server.get('/tvshows', tvHandler);
server.get('/genres', genrehandler);
////
server.get('/getmovies', getMoviesHandler);
// to send the data:
server.post('/addMovies', addMoviesHandler);
//////
server.delete('/deleteMovies/:id', deleteMoviesHandler);
server.put('/updateMovies/:id', updateMoviesHandler);
server.get('/getmovies/:id', getMoviesByIDHandler);
//////

function trendingHandler(req, res){
    axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US")
    
    .then(results =>{
        const trMovies = results.data.results.map(trMovies => {
            return {

                // // to make a new movie object: (using the constructor)
                // let someMovies = new Movie(trMovies.title, trMovies.overview, trMovies.release_date, trMovies.poster_path);
                // return someMovies;

                id: trMovies.id,
                title: trMovies.title,
                release_date: trMovies.release_date,
                poster_path: trMovies.poster_path,
                overview: trMovies.overview
            }
        });
        res.send(trMovies);
    })
    .catch(error => {
        console.log('sorry, something is wrong...',error)
        res.status(500).send(error);
    })
}

//////
function searchHandler(req, res){
    let mName = req.params.movieName;
    // here we can put a movie name in the url to search for it
    // *** the link for the search will be: /search/movie name
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=${mName}&page=1`)
    .then(results => {
        const allMovies = results.data.results.map(allMovies => {
            if(allMovies.original_title === mName){
                    // if(movie.original_title === mName){
                        return{
                            id: allMovies.id,
                            title: allMovies.original_title,
                            poster_path: allMovies.poster_path,
                            release_date: allMovies.release_date,
                            overview: allMovies.overview
                        }

                    // }
                        // let allMovies = [];
                        // results.data.results.forEach((movie) => {
                        // allMovies.push({
                        //     id: movie.id,
                        //     title: movie.original_title,
                        //     poster_path: movie.poster_path,
                        //     release_date: movie.release_date,
                        //     overview: movie.overview
                        // })
                        
                // });
            
            }
        });
        res.send(allMovies);        
        // const searchedMovie = [];
    })
    .catch(error => {
        console.log('sorry, something is wrong...',error)
        res.status(500).send(error);
    })
}
//////
function tvHandler(req, res){
    axios.get(`https://api.themoviedb.org/3/tv/3?api_key=${apiKey}&language=en-US`)
    .then(results => {
        let movie = new Movie(results.id, results.title, results.overview);
        const tvShow = {
            id: results.data.id,
            title: results.data.name,
            release_date: results.data.first_air_date,
            poster_path: results.data.poster_path,
            overview: results.data.overview
        };
        res.send(tvShow);
    })
    .catch(error => {
        console.log('sorry, something is wrong...', error);
        res.status(500).send(error);
    });
}

function genrehandler(req, res){
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    
    .then(results =>{
        const genresList = results.data.genres;
        res.send(genresList);
    })
    .catch(error => {
        console.log('sorry, something is wrong...',error)
        res.status(500).send(error);
    })}


server.get('/', (req, res) => {
    fs.readFile('./Movie Data/data.json', (err, data) => {
        if(err){
            console.log(err);
            res.status(500).send('Sorry, something went wrong...');
            return;
        }
        let movieData = JSON.parse(data);
        res.send(movieData);
    });
});
//////////////////////////////////////////
function getMoviesHandler(req, res){
    const sql = `SELECT * FROM movies`;
    client.query(sql)
    .then(data =>{
        res.send(data.rows);
    })
    .catch((error)=>{
        errorHandler(error, req, res)
    })
}
function addMoviesHandler(req, res){
    const movie = req.body;
    console.log(movie);
    
    const sql = `INSERT INTO movies (movieName, movieInfo, releaseDate, posterPath)
    VALUES ($1, $2, $3, $4)`;
    const values = [movie.movieName, movie.movieInfo, movie.releaseDate, movie.posterPath];
    client.query(sql, values)
    .then(data =>{
        res.send("movies are added successfully")
    })
    .catch((error) => {
        errorHandler(error, req, res);
    })
}
// //////////////////////////////////////////////
function deleteMoviesHandler(req, res){
    let id = req.params.id;
    console.log(req.params);
    let sql = `DELETE FROM movies WHERE movieID=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(202).send(data)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}

function updateMoviesHandler(req, res){
    let {id} = req.params;
    console.log(req.body);
    let sql = `UPDATE movies
    SET movieInfo = $1
    WHERE movieID = ${id};`
    let {movieInfo} = req.body;
    let values = [movieInfo];
    client.query(sql, values)
    .then((data) => {
        res.send(data);
    })
    .catch((error) => {
        errorHandler(error, req, res);
    })

}
function getMoviesByIDHandler(req, res){
    let id = req.params.id;
    const sql = `SELECT * FROM movies
    WHERE movieID = ${id}`;
    client.query(sql)
    .then(data =>{
        res.send(data.rows);
    })
    .catch((error)=>{
        errorHandler(error, req, res)
    })
    
}
//////////////////////////////////////////////
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})


// constructor
function Movie(movieName, movieInfo, releaseDate, posterPath){
    this.movieName = movieName;
    this.movieInfo = movieInfo;
    this.releaseDate = releaseDate;
    this.posterPath = posterPath;
}


// 404:
server.use(function(req, res){
    res.status(404).send('page not found...');
});

function errorHandler(error,req,res){
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
}
client.connect()
.then(() => {
    server.listen(PORT, () =>{
        console.log(`port: ${PORT} , ready`)
    })
});