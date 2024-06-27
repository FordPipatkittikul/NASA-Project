const express = require('express')
const { httpGetAllLaunches,httpAddNewLaunches,httpAbortLaunches } = require("./launches.controller")

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunches);
launchesRouter.delete("/:flightNumber", httpAbortLaunches)

module.exports = launchesRouter;