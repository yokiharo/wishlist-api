/* REQUIRES */
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

/* MODULES */
const session = require('./session');

const app = express();

/* USES */
app.use(bodyparser.json());
app.use(cors({
	origin: 'https://wishlist-quasar.netlify.com'
}));
app.use(session.passport.initialize());

/* ROUTES */
app.get('/', function(req, res) {
	res.send('Welcome to the Wishlist API! "Make your wishes come true!" - Someone');
});

app.get('/auth/google', session.google_login);

app.get('/auth/google/callback', session.google_callback, function(req, res) {
	console.log('user cb');
	console.log(req.user);
	res.redirect('https://wishlist-quasar.netlify.com');
});

app.get('/token', session.check, function(req, res) {
	req.token = session.generateToken(req.user);
	res.json({
		token: req.token,
		user: req.user
	});
})

app.get('/me', session.check, function(req, res) {
  res.json(req.user);
});

app.listen(process.env.PORT || 3000);