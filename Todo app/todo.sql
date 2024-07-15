-- Create the todo table
CREATE TABLE todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    due_date DATE NOT NULL
);


PRAGMA TABLE_INFO(todo);


INSERT INTO todo (todo, category, priority, status, due_date)
VALUES ('Learn Node.js', 'LEARNING', 'HIGH', 'TO DO', '2022-10-10'),
       ('Complete project', 'WORK', 'MEDIUM', 'IN PROGRESS', '2022-11-15'),
       ('Learn Angular.js', 'LEARNING', 'LOW', 'TO DO', '2023-01-11'),
       ('Learn React', 'LEARNING', 'HIGH', 'IN PROGRESS', '2024-09-02'),
       ('Learn Express', 'LEARNING', 'LOW', 'TO DO', '2021-11-12');


SELECT * FROM todo;
