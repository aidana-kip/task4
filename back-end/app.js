console.log('App has started...');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({ origin: '*' , credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(adminRoutes);
app.use((req, res, next) => {
    res.status(404).send('Resource not found!');
});

app.listen(process.env.PORT || 3001);