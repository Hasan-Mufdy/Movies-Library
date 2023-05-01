const express = require('express');
const server = express();
const PORT = 3000;
const fs = require('fs');
const { send } = require('process');

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

// 404:
server.use(function(req, res){
    res.status(404).send('page not found...');
});



server.listen(PORT, () =>{
    console.log(`port: ${PORT} , ready`)
});