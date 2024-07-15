CREATE TABLE IF NOT EXISTS state (
    state_id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_name TEXT NOT NULL,
    population INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS district (
    district_id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_name TEXT NOT NULL,
    state_id INTEGER,
    cases INTEGER,
    cured INTEGER,
    active INTEGER,
    deaths INTEGER,
    FOREIGN KEY (state_id) REFERENCES state (state_id)
);

PRAGMA TABLE_INFO(state);
PRAGMA TABLE_INFO(district);


INSERT INTO state (state_name, population) VALUES 
('Andhra Pradesh', 49577103),
('Assam', 31205576),
('Bihar', 104099452),
('Delhi', 16787941),
('Goa', 1458545),
('Kerala', 33406061),
('Ladakh', 274289),
('Odisha', 41974218),
('Puducherry', 1247953),
('Tamil Nadu', 72147030),
('Telangana', 35003674);


INSERT INTO district (district_name, state_id, cases, cured, active, deaths) VALUES
('Guntur', 1, 100, 90, 8, 2),
('North and Middle Andaman', 1, 200, 180, 15, 5),
('South Andaman', 1, 300, 270, 20, 10),
('Anantapur', 2, 1500, 1400, 80, 20),
('Chittoor', 2, 1800, 1700, 70, 30),
('East Godavari', 2, 2000, 1900, 50, 50);



SELECT * FROM state;


SELECT * FROM district;
