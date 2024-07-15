const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtAuth = require('./jwtAuth');
const port = 2222;

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'twiter.db');

let db;
const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
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

// User Registration
app.post('/register/', async (req, res) => {
    const { username, password, name, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.get('SELECT * FROM user WHERE username = ?', [username]);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password is too short' });
    }
    const query = 'INSERT INTO user (name, username, password, gender) VALUES (?, ?, ?, ?)';
    await db.run(query, [name, username, hashedPassword, gender]);
    res.status(200).json({ message: 'User created successfully' });
});

// User Login
app.post('/login/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await db.get('SELECT * FROM user WHERE username = ?', [username]);
    if (!user) {
        return res.status(400).json({ message: 'Invalid user' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const jwtToken = jwt.sign({ userId: user.user_id }, 'AJAY_SECRET_KEY', { expiresIn: '1h' });
    res.status(200).json({ jwtToken });
});

// Get Latest Tweets of Followed Users
app.get('/user/tweets/feed/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const query = `
        SELECT user.username, tweet.tweet, tweet.date_time AS dateTime
        FROM tweet
        INNER JOIN follower ON tweet.user_id = follower.following_user_id
        INNER JOIN user ON tweet.user_id = user.user_id
        WHERE follower.follower_user_id = ?
        ORDER BY tweet.date_time DESC
        LIMIT 4`;
    const tweets = await db.all(query, [userId]);
    res.json(tweets);
});

// Get Names of People User Follows
app.get('/user/following/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const query = `
        SELECT user.name
        FROM user
        INNER JOIN follower ON user.user_id = follower.following_user_id
        WHERE follower.follower_user_id = ?`;
    const following = await db.all(query, [userId]);
    res.json(following);
});

// Get Names of Followers
app.get('/user/followers/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const query = `
        SELECT user.name
        FROM user
        INNER JOIN follower ON user.user_id = follower.follower_user_id
        WHERE follower.following_user_id = ?`;
    const followers = await db.all(query, [userId]);
    res.json(followers);
});

// Get Tweet by ID
app.get('/tweets/:tweetId/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const { tweetId } = req.params;
    const query = `
        SELECT tweet.tweet, tweet.date_time AS dateTime,
               (SELECT COUNT(*) FROM like WHERE tweet_id = ?) AS likes,
               (SELECT COUNT(*) FROM reply WHERE tweet_id = ?) AS replies
        FROM tweet
        INNER JOIN follower ON tweet.user_id = follower.following_user_id
        WHERE follower.follower_user_id = ? AND tweet.tweet_id = ?`;
    const tweet = await db.get(query, [tweetId, tweetId, userId, tweetId]);
    if (!tweet) {
        return res.status(401).json({ message: 'Invalid Request' });
    }
    res.json(tweet);
});

// Get Users Who Liked a Tweet
app.get('/tweets/:tweetId/likes/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const { tweetId } = req.params;
    const query = `
        SELECT user.username
        FROM user
        INNER JOIN like ON user.user_id = like.user_id
        WHERE like.tweet_id = ? AND like.user_id IN (
            SELECT following_user_id FROM follower WHERE follower_user_id = ?
        )`;
    const likes = await db.all(query, [tweetId, userId]);
    if (likes.length === 0) {
        return res.status(401).json({ message: 'Invalid Request' });
    }
    res.json({ likes: likes.map(like => like.username) });
});

// Get Replies for a Tweet
app.get('/tweets/:tweetId/replies/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const { tweetId } = req.params;
    const query = `
        SELECT user.name, reply.reply
        FROM reply
        INNER JOIN user ON reply.user_id = user.user_id
        WHERE reply.tweet_id = ? AND reply.user_id IN (
            SELECT following_user_id FROM follower WHERE follower_user_id = ?
        )`;
    const replies = await db.all(query, [tweetId, userId]);
    if (replies.length === 0) {
        return res.status(401).json({ message: 'Invalid Request' });
    }
    res.json({ replies });
});

// Get All Tweets of the User
app.get('/user/tweets/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const query = `
        SELECT tweet.tweet, tweet.date_time AS dateTime,
               (SELECT COUNT(*) FROM like WHERE like.tweet_id = tweet.tweet_id) AS likes,
               (SELECT COUNT(*) FROM reply WHERE reply.tweet_id = tweet.tweet_id) AS replies
        FROM tweet
        WHERE tweet.user_id = ?`;
    const tweets = await db.all(query, [userId]);
    res.json(tweets);
});

// Create a Tweet
app.post('/user/tweets/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const { tweet } = req.body;
    const query = 'INSERT INTO tweet (tweet, user_id) VALUES (?, ?)';
    await db.run(query, [tweet, userId]);
    res.status(200).json({ message: 'Created a Tweet' });
});

// Delete a Tweet
app.delete('/tweets/:tweetId/', jwtAuth, async (req, res) => {
    const { userId } = req;
    const { tweetId } = req.params;
    const tweet = await db.get('SELECT * FROM tweet WHERE tweet_id = ? AND user_id = ?', [tweetId, userId]);
    if (!tweet) {
        return res.status(401).json({ message: 'Invalid Request' });
    }
    const query = 'DELETE FROM tweet WHERE tweet_id = ?';
    await db.run(query, [tweetId]);
    res.status(200).json({ message: 'Tweet Removed' });
});

module.exports = app;
