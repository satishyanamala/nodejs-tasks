const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const { format } = require('date-fns');
const port = 3333;

const app = express();

app.use(express.json());

const dbpath = path.join(__dirname, 'todo.db');

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

//  1: Get all todos
app.get('/todos/', async (req, res) => {
    const { status, priority, category, search_q = "" } = req.query;
    let query = 'SELECT * FROM todo WHERE todo LIKE ?';
    const params = [`%${search_q}%`];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    if (priority) {
        query += ' AND priority = ?';
        params.push(priority);
    }
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    try {
        const todos = await db.all(query, params);
        res.json(todos);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//  2: Get a specific todo
app.get('/todos/:todoId/', async (req, res) => {
    const { todoId } = req.params;
    const query = 'SELECT * FROM todo WHERE id = ?';

    try {
        const todo = await db.get(query, [todoId]);
        res.json(todo);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//  3: Create a new todo
app.post('/todos/', async (req, res) => {
    const { todo, category, priority, status, dueDate } = req.body;
    const query = 'INSERT INTO todo (todo, category, priority, status, due_date) VALUES (?, ?, ?, ?, ?)';

    try {
        await db.run(query, [todo, category, priority, status, dueDate]);
        res.status(201).send('Todo Successfully Added');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//  4: Update a specific todo
app.put('/todos/:todoId/', async (req, res) => {
    const { todoId } = req.params;
    const { todo, category, priority, status, dueDate } = req.body;
    const query = 'UPDATE todo SET todo = ?, category = ?, priority = ?, status = ?, due_date = ? WHERE id = ?';

    try {
        await db.run(query, [todo, category, priority, status, dueDate, todoId]);
        res.send('Todo Updated Successfully');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
//  5: Delete a specific todo
app.delete('/todos/:todoId/', async (req, res) => {
    const { todoId } = req.params;
    const query = 'DELETE FROM todo WHERE id = ?';

    try {
        await db.run(query, [todoId]);
        res.send('Todo Deleted Successfully');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



