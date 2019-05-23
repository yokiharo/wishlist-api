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
app.use(cors());
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

app.get('/load', session.check, async function(req, res) {
  res.json({ user: req.user, user_list: await list.findOne({ id: req.user.id }) });
})

app.post('/save', session.check, async function(req, res) {
	const new_list = new list({ id: req.user.id, items: req.body.items });
	await list.findOneAndUpdate({ id: req.user.id }, new_list, { upsert: true });
	res.sendStatus(200);
})

app.post('/logout', function (req, res) {
	req.logout();
})

app.listen(process.env.PORT || 3000);