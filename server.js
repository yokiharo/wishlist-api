/* REQUIRES */
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();

const app = express(); 

/* USES */
app.use(bodyparser.json());

/* ROUTES */
app.get('/', function(req, res) {
	res.send(process.env.SECRET);
});

app.listen(process.env.port || 3000);