const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const port = 7777;

app.use(express.json());

const dbpath = path.join(__dirname, 'player.db');
console.log(dbpath);  

let db = null;

// db connection 
const initializeDbAndServer = async () => {
    try {
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


// get all teammeabers in the db

app.get("/player", async (req, res) => {
    try {
        const getplayerQuery = 'SELECT * FROM players';
        const player = await db.all(getplayerQuery);
        res.status(200).json({ players: player });
    } catch (e) {
        console.log(`getPlayersrror: ${e.message}`);
        res.status(500).send("Internal server error");
    }
});

// Get a specific players

app.get("/players/:playerId", async (req, res) => {
    try {
        const { playerId } = req.params;
        console.log(playerId);

        const playerQuery = `SELECT * FROM players WHERE player_id = ?`;
        const player = await db.get(playerQuery, [playerId]);
        res.status(200).json({ player });
    } catch (e) {
        console.log("players", e.message);
        res.status(500).send("Internal Server Error");
    }
});

// Add post  metthod

app.post('/players', async (req, res) => {
    try {
        const { playerName, jerseyNumber, role } = req.body;
        const addplayerQuery = `
            INSERT INTO players (player_name, jersey_number, role)
            VALUES (?, ?, ?);
        `;
        await db.run(addplayerQuery, [playerName, jerseyNumber, role]);
        res.status(201).send("Player Added to Team");
    } catch (e) {
        console.log("player", e.message);
        res.status(500).send("Internal Server Error");
    }
});

// Update a player by ID

app.put("/players/:playerId", async (req, res) => {
    try {
        const { playerId } = req.params;
        const { playerName, jerseyNumber, role } = req.body;
        const updatePlayerQuery = `
            UPDATE players
            SET player_name = ?, jersey_number = ?, role = ?
            WHERE player_id = ?;
        `;
        const result = await db.run(updatePlayerQuery, [playerName, jerseyNumber, role, playerId]);
        if (result.changes === 0) {
            res.status(404).send("Player not found");
        } else {
            res.status(200).send("Player Details Updated");
        }
    } catch (e) {
        console.log(`updatePlayerByIdError: ${e.message}`);
        res.status(500).send("Internal server error");
    }
});

// Delete a player by ID
app.delete("/player/:playerId", async (req, res) => {
    try {
        const { playerId } = req.params;
        const deleteplayersQuery = `
            DELETE FROM players
            WHERE player_id = ?;
        `;
        const result = await db.run(deleteplayersQuery, [playerId]);
        if (result.changes === 0) {
            res.status(404).send("Player not found");
        } else {
            res.status(200).send("Player Removed");
        }
    } catch (e) {
        console.log(`deletePlayerByIdError: ${e.message}`);
        res.status(500).send("Internal server error");
    }
});

