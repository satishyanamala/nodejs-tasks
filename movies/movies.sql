CREATE TABLE movie (
    movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
    director_id INTEGER NOT NULL,
    movie_name TEXT NOT NULL,
    lead_actor TEXT NOT NULL,
    FOREIGN KEY (director_id) REFERENCES director(director_id)
);


CREATE TABLE director (
    director_id INTEGER PRIMARY KEY AUTOINCREMENT,
    director_name TEXT NOT NULL
);

PRAGMA TABLE_INFO(movie,director);


INSERT INTO director (director_name) VALUES
    ('Joe Johnston'),
    ('Steven Spielberg'),
    ('Peter Jackson'),
    ('Rajkumar Hirani'),
    ('Christopher Nolan');


INSERT INTO movie (director_id, movie_name, lead_actor) VALUES
    (1, 'Captain America: The First Avenger', 'Chris Evans'),
    (2, 'Jurassic Park', 'Sam Neill'),
    (3, 'The Lord of the Rings', 'Elijah Wood'),
    (4, '3 Idiots', 'Aamir Khan'),
    (5, 'Inception', 'Leonardo DiCaprio');


    
SELECT * FROM director;


SELECT * FROM movie;


