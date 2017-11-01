'use strict';

const express = require('express');
const session = require('express-session');
const dotenv  = require('dotenv').config();

// Configure the routing to serve public folder
const app = express();
app.use(express.static('public'));
// Serve node modules for webpage files to usex
app.use('/modules', express.static(__dirname + '/node_modules'));

app.listen(3000);
console.log('Serving');

app.get('/mainpage', (req,res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.get('/login', (req,res) => {
	// With a proper backend, here should happen user authentication from database
	// Instead, lets simulate a user object 
	let tempUser = {
		name: 'Matti Meikäläinen',
		age: 35,
		children: 
		[ 
			{
				name: 'Jussi Meikäläinen',
				age: 7
			},
			{
				name: 'Ossi Meikäläinen',
				age: 6
			}

		]
	};

	console.log(tempUser);
	// Send user object back to client
	res.send(JSON.stringify({user: tempUser}));
});
