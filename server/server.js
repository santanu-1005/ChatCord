require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const connectDb = require('./config/db');
const initSocket = require('./sockets/chatSocket');

const app = express();

connectDb();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

initSocket(server);