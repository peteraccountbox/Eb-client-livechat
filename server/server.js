const express = require('express');
const path = require('path');
const cors = require('cors');


const app = express();
const PORT = 3031;


app.use(cors());

// Serve static files from the 'dist' directory
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// A simple route
app.get('/main/*', (req, res) => {
    res.sendFile(path.join(__dirname, './../build/main/main.min.js'));
});

// A simple route
app.get('/test/*', (req, res) => {
    res.sendFile(path.join(__dirname, './test.html'));
});

// A simple route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './../build/loader/main.min.js'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
