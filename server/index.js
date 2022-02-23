const express = require('express');
const app = express();
const PORT = process.env.PORT | 4000;
const cors = require('cors');

app.use(cors());

app.get('/test', (req, res) => {
	console.log('we are getting signal!!!')
	res.json({ text: 'Broooo it works!!!!' });
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
