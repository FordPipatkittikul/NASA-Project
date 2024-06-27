const axios = require('axios')

const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 10;

const SPACEX_API_URL= 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches(){

    const response = await axios.post(SPACEX_API_URL, {
        query : {},
        options : {
            pagination: false,
            populate : [
                {
                    path : "rocket",
                    select : {
                        name : 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
                
            ]
        }
    })

    if(response.status !== 200){
        console.log('Problem downloading data')
        throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            launchDate: launchDoc['date_local'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
        }
        saveLaunch(launch);
    }
}

async function loadLaunchData(){
    
    const firstLaunch = await findLaunch({
        flightNumber:1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })
    
    if(firstLaunch){
        console.log('launch data already loaded')
    }else{
        console.log('downloading launch data')
        await populateLaunches()
    }
    
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithFlightNumber(flightNumber){
    const filter = {flightNumber: flightNumber}
    const launchExists = await findLaunch(filter);
    return launchExists
}

async function getLatestFlightNumber() {
    const lastestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if(!lastestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return lastestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit){
    return await launchesDatabase.find(
        {}, 
        {'_id':0, '__v':0} 
    )
    .sort({ flightNumber: 1}) //ascending order
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch){
    const filter = {flightNumber: launch.flightNumber}
    const update = launch
    await launchesDatabase.findOneAndUpdate(filter, update, { upsert: true })
}

async function checkPlanetExist(launch){
    const planet = await planetsDatabase.findOne({
        keplerName: launch.target
    })
    
    if(!planet){
        throw new Error('No matching planet found');
    }
}

async function scheduleNewLaunch(launch){

    checkPlanetExist(launch)

    let lastestFlightNumber = await getLatestFlightNumber()
    lastestFlightNumber++;
    const newLaunch = Object.assign(launch, {
        flightNumber: lastestFlightNumber,
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA']
    });
    await saveLaunch(newLaunch)

}

async function abortLaunch(flightNumber){
    const filter = {flightNumber: flightNumber}
    const aborted = await launchesDatabase.findOneAndUpdate(filter, {
        upcoming : false,
        success : false
    })
    return aborted
}

module.exports = {
    loadLaunchData,
    existsLaunchWithFlightNumber,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch,
}