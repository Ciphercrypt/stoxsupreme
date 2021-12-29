const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// SETUP
dotenv.config({ path: './server/config/.env' });

const app = express();
const port = process.env.PORT || 6000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('secretcode'));

// DATABASE
const MONGO_URI = process.env.MONGO_URI;

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser    : true,
		useCreateIndex     : true,
		useUnifiedTopology : true,
		useFindAndModify   : false
	})
	.then(() => console.log(`Successfully connected to MongoDB`))
	.catch((err) => console.log(err));

// ROUTES
const authRouter = require('./routes/authRoutes');
const dataRouter = require('./routes/dataRoutes');
const newsRouter = require('./routes/newsRoutes');
const stockRouter = require('./routes/stockRoutes');

app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/api/news', newsRouter);
app.use('/api/stock', stockRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + '/../client/build/index.html'));
	});
}

// APP
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
