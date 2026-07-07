require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => 
    console.log('Connected to MongoDB'))
.catch((err) =>
    console.log('MongoDB not connected', err));

app.get('/', (req,res) => {
    res.send('Welcome to Lecture Scheduler ');
});

app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});