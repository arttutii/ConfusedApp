'use strict';

const express = require('express');
const session = require('express-session');
const dotenv  = require('dotenv').config();

// Configure the routing to serve public folder
const app = express();
app.use(express.static('public'));
// Serve node modules for webpage files to use
app.use('/modules', express.static(__dirname + '/node_modules'));

app.listen(3000);
console.log('Serving');

app.get('/frontpage', (req,res) => {
    res.sendFile('frontpage.html', { root: 'public' });
});

