CREATE TABLE  players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    jersey_number INTEGER NOT NULL,
    role TEXT NOT NULL
);

PRAGMA TABLE_INFO(players);

INSERT INTO players (player_name, jersey_number, role) VALUES 
('virat', 18, 'batsman'),
('dhoni', 7, 'batsman'),
('bumarh', 23, 'bowler'),
('siraj', 27, 'bowler'),
('rohith', 45, 'batsman');





SELECT * FROM players;