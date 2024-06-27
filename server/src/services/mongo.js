const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connection.once('open', () => {
    console.log("MongoDB connection is ready!")
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function connectDatabase() {
    await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
    connectDatabase
}