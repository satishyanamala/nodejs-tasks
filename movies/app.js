const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const port = 8888;

const app = express();

app.use(express.json());

const dbpath = path.join(__dirname, 'movies.db');

let db;

const initializeDbAndServer = async () => {
    try{
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database
        });
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}/`);
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
    }
};

initializeDbAndServer();

//  1: Get all movies

app.get('/movies/', async (req, res) => {
    try {
        const query = 'SELECT movie_name AS movieName FROM movie';
        const movies = await db.all(query);
        res.json(movies);
    } catch (e) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  2: post 
app.post('/movies/', async (req, res) => {
    try {
        const { directorId, movieName, leadActor } = req.body;
        const query = 'INSERT INTO movie (director_id, movie_name, lead_actor) VALUES (?, ?, ?)';
        
        await db.run(query, [directorId, movieName, leadActor]);
        res.status(201).send('Movie successfully added');
    } catch (error) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});
//  3: Get a movie by ID
app.get('/movies/:movieId/', async (req, res) => {
    try {
        const { movieId } = req.params;
        const query = 'SELECT * FROM movie WHERE movie_id = ?';
        const movie = await db.get(query, [movieId]);
        res.json(movie);
    } catch (error) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

// 4: Update a movie by ID
app.put('/movies/:movieId/', async (req, res) => {
    try {
        const { movieId } = req.params;
        const { directorId, movieName, leadActor } = req.body;
        const query = `
            UPDATE movie
            SET director_id = ?, movie_name = ?, lead_actor = ?
            WHERE movie_id = ?
        `;
        const result = await db.run(query, [directorId, movieName, leadActor, movieId]);
        if (result.changes === 0) {
            res.status(404).send('Movie not found');
        } else {
            res.send('Movie Details Updated');
        }
    } catch (error) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  5: Delete a movie by ID
app.delete('/movies/:movieId/', async (req, res) => {
    try {
        const { movieId } = req.params;
        const query = 'DELETE FROM movie WHERE movie_id = ?';
        const result = await db.run(query, [movieId]);
        if (result.changes === 0) {
            res.status(404).send('Movie not found');
        } else {
            res.send('Movie Removed');
        }
    } catch (error) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});
//  6: Get all directors
app.get('/directors/', async (req, res) => {
    try {
        const query = 'SELECT * FROM director';
        const directors = await db.all(query);
        res.json(directors);
    } catch (error) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  7: Get all movies by a specific director
app.get('/directors/:directorId/movies/', async (req, res) => {
    try {
        const { directorId } = req.params;
        const query = 'SELECT movie_name AS movieName FROM movie WHERE director_id = ?';
        const movies = await db.all(query, [directorId]);
        res.json(movies);
    } catch (error) {
        console.log(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});


