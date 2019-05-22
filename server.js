/* REQUIRES */
const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

const app = express();

passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "https://wishlist-quasar-api.herokuapp.com/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, cb) {
		// User.findOrCreate({ googleId: profile.id }, function (err, user) {
		// 	return cb(err, user);
		// });
		//console.log(profile);
		cb(null, profile);
	}
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
	// Successful authentication, redirect home.
	res.redirect('https://wishlist-quasar.netlify.com');
});


/* USES */
app.use(bodyparser.json());

/* ROUTES */
app.get('/', function(req, res) {
	res.send('Welcome to the Wishlist API! "Make your wishes come true!" - Someone');
});

app.listen(process.env.PORT || 3000);