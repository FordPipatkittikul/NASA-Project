const { existsLaunchWithFlightNumber,getAllLaunches,scheduleNewLaunch,abortLaunch } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req,res){
    try{
        const {skip , limit} = getPagination(req.query);
        const launches = await getAllLaunches(skip, limit);
        return res.status(200).json(launches);
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "fail to get all launches"})
    }
}

async function httpAddNewLaunches(req, res){
    const newLaunch = req.body;
    try{
        /* Validation: For missing body
            
        */
        if (!newLaunch.mission || !newLaunch.rocket || !newLaunch.launchDate || !newLaunch.target){
            return res.status(400).json({
                error: "Missing required launch property"
            });
        }

        newLaunch.launchDate = new Date(newLaunch.launchDate);

        /* Validation: For wrong date value
           If user give a correct value for launchDate using Date() will transform to a number.
           And is not a number will be true for incorrect value for launchDate.
        */
        if(isNaN(newLaunch.launchDate)) {
            return res.status(400).json({
                error: "Invalid launch date"
            })
        }

        await scheduleNewLaunch(newLaunch);
        return res.status(201).json(newLaunch);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg: "fail to add new launch"})
    }
}

async function httpAbortLaunches(req, res){
    const flightNumber = Number(req.params.flightNumber);
    try{

        /* Validation: If launch does not exist
            
        */
       const existLaunch = await existsLaunchWithFlightNumber(flightNumber)
        if(!existLaunch){
            return res.status(404).json({error: "launch does not exist"})
        }

        const aborted = await abortLaunch(flightNumber)
        return res.status(200).json(aborted)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "fail to abort launch"})
    }
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunches
}