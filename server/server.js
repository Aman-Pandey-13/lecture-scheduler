require('dotenv').config();

const expess = require('express');
const moongoose = require('mongoose');
const cors = require('cors');

const app = expess();
app.use(cors());
app.use(expess.json());

moongoose.connect(process.env.MONGO_URI)
.then(() => 
    console.log('Connected to MongoDB'))
.catch((err) =>
    console.log('MongoDB not connected', err));

app.get('/', (req,res) => {
    res.send('Welcome to Lecture Scheduler ');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});