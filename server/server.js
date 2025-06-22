const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const routes = require('./routes');
const path = require('path')
const http = require('http');
const initSocket = require('./config/socket');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDb();

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
