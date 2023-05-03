'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config();

server.use(cors());
const PORT = 3000;
let axios = require('axios');
const fs = require('fs');
const { send } = require('process');

//////
server.get('/trending', trendingHandler);
server.get('/search', searchHandler);

server.get('/tvshows', tvHandler);
server.get('/genres', genrehandler);

//////

function trendingHandler(req, res){
    axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US")
    
    .then(results =>{
        const trMovies = results.data.results.map(trMovies => {
            return {
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
    
    // movie name will be added here manually:
    let mName = "The Simpsons Meet the Bocellis in Feliz Navidad";
    ////
    
    axios.get("https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2")
    .then(results => {
        // const allMovies = results.data.results.map(allMovies => {
            // if(allMovies.original_title === mName){
            let allMovies = [];
                results.data.results.forEach((movie) => {
                    if(movie.original_title === mName){
                        allMovies.push({
                            id: movie.id,
                            title: movie.original_title,
                            poster_path: movie.poster_path,
                            release_date: movie.release_date,
                            overview: movie.overview
                        })
                    }
                    
                });
            
            // }
        // });
        res.send(allMovies);        
        // const searchedMovie = [];
    })
    .catch(error => {
        console.log('sorry, something is wrong...',error)
        res.status(500).send(error);
    })
}
//////
function tvHandler(){
    //
}
function genrehandler(){
    //
}


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


server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})

// function Movies(){

// }


// 404:
server.use(function(req, res){
    res.status(404).send('page not found...');
});



server.listen(PORT, () =>{
    console.log(`port: ${PORT} , ready`)
});