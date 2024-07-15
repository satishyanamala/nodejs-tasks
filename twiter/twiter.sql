CREATE TABLE user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT UNIQUE,
    password TEXT,
    gender TEXT
);

CREATE TABLE follower (
    follower_id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_user_id INTEGER,
    following_user_id INTEGER,
    FOREIGN KEY (follower_user_id) REFERENCES user(user_id),
    FOREIGN KEY (following_user_id) REFERENCES user(user_id)
);

CREATE TABLE tweet (
    tweet_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet TEXT,
    user_id INTEGER,
    date_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE reply (
    reply_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER,
    reply TEXT,
    user_id INTEGER,
    date_time DATETIME,
    FOREIGN KEY (tweet_id) REFERENCES tweet(tweet_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE like (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER,
    user_id INTEGER,
    date_time DATETIME,
    FOREIGN KEY (tweet_id) REFERENCES tweet(tweet_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

PRAGMA TABLE_INFO(user);
PRAGMA TABLE_INFO(follower);
PRAGMA TABLE_INFO(tweet);
PRAGMA TABLE_INFO(reply);
PRAGMA TABLE_INFO(like);

INSERT INTO user (name, username, password, gender) VALUES 
('Joe Biden', 'JoeBiden', 'biden@123', 'male'),
('Narendra Modi', 'NarendraModi', 'modi@123', 'male'),
('Elon Musk', 'ElonMusk', 'musk@123', 'male');


INSERT INTO follower (follower_user_id, following_user_id) VALUES
(1, 2), -- Joe Biden follows Narendra Modi
(1, 3), -- Joe Biden follows Elon Musk
(2, 1), -- Narendra Modi follows Joe Biden
(3, 1); -- Elon Musk follows Joe Biden


INSERT INTO tweet (tweet, user_id, date_time) VALUES
('Just signed a major infrastructure bill!', 1, '2022-01-01 10:00:00'),
('India is on the rise!', 2, '2022-01-01 11:00:00'),
('SpaceX is ready to launch!', 3, '2022-01-01 12:00:00');


INSERT INTO reply (tweet_id, reply, user_id, date_time) VALUES
(1, 'Congratulations!', 2, '2022-01-01 10:05:00'),
(2, 'Absolutely!', 1, '2022-01-01 11:05:00'),
(3, 'Can’t wait to see it!', 2, '2022-01-01 12:05:00');


INSERT INTO like (tweet_id, user_id, date_time) VALUES
(1, 2, '2022-01-01 10:10:00'),
(2, 1, '2022-01-01 11:10:00'),
(3, 1, '2022-01-01 12:10:00');

SELECT * FROM user;
SELECT * FROM follower;
SELECT * FROM tweet;
SELECT * FROM reply;
SELECT * FROM like;
