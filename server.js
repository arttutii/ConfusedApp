'use strict';
const http 	   = require('http');
const https    = require('https');
const forceSSL = require('express-force-ssl');
const express  = require('express');
const session  = require('express-session');
const dotenv   = require('dotenv').config();
const fs 	   = require('fs');

// Configure the routing to serve public folder
const app = express();
app.use(express.static('public'));
// Serve node modules for webpage files to usex
app.use('/modules', express.static(__dirname + '/node_modules'));

app.enable('trust proxy');

// Create SSL for HTTPS site
app.use(forceSSL);

const options = {
  key: fs.readFileSync('encryption/key.pem'),
  cert: fs.readFileSync('encryption/cert.pem')
};

// Configure application to port 3000
const httpServer = http.createServer(app).listen(3000);
const httpsServer = https.createServer(options, app).listen(8080);

console.log('Serving');

app.get('/login', (req,res) => {
	// With a proper backend, here should happen user authentication from database
	// Instead, lets simulate a user object 
	let tempUser = {
		name: 'Matti Meikäläinen',
		age: 35,
		children: 
		[ 
			{
				// Personal information
				name: 'Jussi Meikäläinen',
				age: 7,
				gender: 'Mies',
				birthDate: '08-03-2010',
				birthPlace: 'Helsinki, Finland',
				residence: 'Helsinki',
				address: 'Junailijankuja 7',
				postalCode: '00520 HELSINKI',
				phone: null,
				email: null,
				// Education
				currentEducationName: 'Päiväkoti Meripirtti',
				currentEducationPeriod: '20-04-2008 - 01-01-2011',
				currentEducationContact: {
					phone: 'Puhelin: 09 3102 9904',
					address: 'Merimiehenkatu 43, 00150 Helsinki',
					email: 'Sähköposti: pk.meripirtti@hel.fi',
					principal: 'Johtaja: Riitta Tähtilaakso, puh. 09 3102 9904',
					principalEmail: 'Sähköposti: riitta.tahtilaakso@hel.fi',
				},
				currentEducationHomepage: 'https://www.hel.fi/helsinki/fi/kasvatus-ja-koulutus/paivahoito/paivakotihoito/paivakodit/paivakoti-meripirtti',
			},
			{
				// Personal information
				name: 'Ossi Meikäläinen',
				age: 6,
				gender: 'Mies',
				birthDate: '15-01-2011',
				birthPlace: 'Helsinki, Finland',
				residence: 'Helsinki',
				address: 'Junailijankuja 7',
				postalCode: '00520 HELSINKI',
				phone: null,
				email: null,
				// Education
				currentEducationName: 'Päiväkoti Meripirtti',
				currentEducationPeriod: '20-04-2008 - 01-01-2011',
				currentEducationContact: {
					phone: 'Puhelin: 09 3102 9904',
					address: 'Merimiehenkatu 43, 00150 Helsinki',
					email: 'Sähköposti: pk.meripirtti@hel.fi',
					principal: 'Johtaja: Riitta Tähtilaakso, puh. 09 3102 9904',
					principalEmail: 'Sähköposti: riitta.tahtilaakso@hel.fi',
				},
				currentEducationHomepage: 'https://www.hel.fi/helsinki/fi/kasvatus-ja-koulutus/paivahoito/paivakotihoito/paivakodit/paivakoti-meripirtti',
			
			}

		]
	};

	console.log(tempUser);
	// Send user object back to client
	res.send(JSON.stringify(tempUser));
});
