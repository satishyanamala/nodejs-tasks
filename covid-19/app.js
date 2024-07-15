const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const port = 9999;

const app = express();

app.use(express.json());

const dbpath = path.join(__dirname, 'covid19.db');

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

//  1: Get all states
app.get('/states/', async (req, res) => {
    try {
        const query = 'SELECT state_id AS stateId, state_name AS stateName, population FROM state';
        const states = await db.all(query);
        res.json(states);
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});
// 2: Get state by ID
app.get('/states/:stateId/', async (req, res) => {
    try {
        const { stateId } = req.params;
        const query = 'SELECT state_id AS stateId, state_name AS stateName, population FROM state WHERE state_id = ?';
        const state = await db.get(query, [stateId]);
        res.json(state);
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

// API 3: Create a district
app.post('/districts/', async (req, res) => {
    try {
        const { districtName, stateId, cases, cured, active, deaths } = req.body;
        const query = `
            INSERT INTO district (district_name, state_id, cases, cured, active, deaths)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.run(query, [districtName, stateId, cases, cured, active, deaths]);
        res.status(201).send('District Successfully Added');
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  4: Get district by ID
app.get('/districts/:districtId/', async (req, res) => {
    try {
        const { districtId } = req.params;
        const query = 'SELECT district_id AS districtId, district_name AS districtName, state_id AS stateId, cases, cured, active, deaths FROM district WHERE district_id = ?';
        const district = await db.get(query, [districtId]);
        res.json(district);
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  5: Delete district by ID
app.delete('/districts/:districtId/', async (req, res) => {
    try {
        const { districtId } = req.params;
        const query = 'DELETE FROM district WHERE district_id = ?';
        await db.run(query, [districtId]);
        res.send('District Removed');
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

// 6: Update district by ID
app.put('/districts/:districtId/', async (req, res) => {
    try {
        const { districtId } = req.params;
        const { districtName, stateId, cases, cured, active, deaths } = req.body;
        const query = `
            UPDATE district
            SET district_name = ?, state_id = ?, cases = ?, cured = ?, active = ?, deaths = ?
            WHERE district_id = ?
        `;
        await db.run(query, [districtName, stateId, cases, cured, active, deaths, districtId]);
        res.send('District Details Updated');
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  7: Get statistics of a specific state
app.get('/states/:stateId/stats/', async (req, res) => {
    try {
        const { stateId } = req.params;
        const query = `
            SELECT 
                SUM(cases) AS totalCases,
                SUM(cured) AS totalCured,
                SUM(active) AS totalActive,
                SUM(deaths) AS totalDeaths
            FROM district
            WHERE state_id = ?
        `;
        const stats = await db.get(query, [stateId]);
        res.json(stats);
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

//  8: Get state name of a district
app.get('/districts/:districtId/details/', async (req, res) => {
    try {
        const { districtId } = req.params;
        const query = `
            SELECT state.state_name AS stateName
            FROM district
            JOIN state ON district.state_id = state.state_id
            WHERE district.district_id = ?
        `;
        const state = await db.get(query, [districtId]);
        res.json(state);
    } catch (error) {
        console.error(`API error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});


