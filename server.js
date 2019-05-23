/* REQUIRES */
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO, {useNewUrlParser: true});

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

/* MODELS */
const list = mongoose.model('list', { id: String, updated: { type: Date, default: Date.now }, items: [] });

/* ROUTES */
app.get('/', function(req, res) {
	res.send('Welcome to the Wishlist API! "Make your wishes come true!" - Someone');
});

app.get('/auth/google', session.google_login);

app.get('/auth/google/callback', session.google_callback, function(req, res) {
	req.token = session.generateToken(req.user);
	res.redirect('https://wishlist-quasar.netlify.com/?token=' + req.token);
})

app.get('/load', session.check, function(req, res) {
  res.json({ user: req.user, items: list.findOne({ id: req.user.id }) }); // TO DO: ADD ITEMS FROM DB IN RESPONSE
})

app.post('/save', session.check, function(req, res) {
	const new_list = new list({ id: req.user.id, items: req.body.items });
	list.findOneAndUpdate({ id: req.user.id }, new_list, { upsert: true }).then(function() {
		res.sendStatus(200);
	})
	// TO DO: SAVE ITEMS TO DB FOR THIS USER (req.body.items)
})

app.post('/logout', function (req, res) {
	req.logout();
})

app.listen(process.env.PORT || 3000);