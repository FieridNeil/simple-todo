const express = require('express');
const app = express();
const PORT = 4005;
const cors = require('cors');

app.use(cors());

app.get('/test', (req, res) => {
	res.json({ text: 'Broooo it works!!!!' });
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
