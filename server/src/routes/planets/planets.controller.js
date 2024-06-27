const {getAllPlanets} = require("../../models/planets.models");

async function httpGetAllPlanets(req,res){
    try{
        return res.status(200).json(await getAllPlanets());
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "fail to get all planets"})
    }
}

module.exports = {
    httpGetAllPlanets,
}