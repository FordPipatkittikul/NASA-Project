const http = require("http");

// require('dotenv').config();

const app = require("./app");
const { connectDatabase } = require("./services/mongo")
const { loadPlanetsData } = require("./models/planets.models")
const { loadLaunchData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000
const server = http.createServer(app);

async function startServer() {
    await connectDatabase();
    await loadPlanetsData();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
}

startServer();

