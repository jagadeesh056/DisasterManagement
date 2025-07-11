require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { initSockets } = require('./sockets');
const disasterRoutes = require('./routes/disasters');
const geocodingRoutes = require('./routes/geocoding');
const socialMediaRoutes = require('./routes/socialMedia');
const resourcesRoutes = require('./routes/resources');
const updatesRoutes = require('./routes/updates');
const verificationRoutes = require('./routes/verification');
const reportsRoutes = require('./routes/reports');
const { limiter } = require('./middleware/rateLimit');

const app = express();
const server = http.createServer(app);
const io = initSockets(server);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
}));

app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/disasters', disasterRoutes);
app.use('/geocode', limiter, geocodingRoutes);
app.use('/disasters', limiter, socialMediaRoutes);
app.use('/disasters', resourcesRoutes);
app.use('/disasters', limiter, updatesRoutes);
app.use('/disasters', limiter, verificationRoutes);
app.use('/disasters', reportsRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));