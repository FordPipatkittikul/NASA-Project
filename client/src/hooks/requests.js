const API_URL = "http://localhost:8000/v1";

// Load planets and return as JSON.
async function httpGetPlanets() {
  try{
    const res = await fetch(`${API_URL}/planets`);
    return await res.json();
  }catch(err){
    console.log(err);
  }
}

// Load launches, sort by flight number, and return as JSON.
// quick note on sort() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
async function httpGetLaunches() {
  try{
    const res = await fetch(`${API_URL}/launches`);
    const fetchedLaunches =  await res.json();
    return fetchedLaunches.sort((a,b) => a.flightNumber - b.flightNumber);
  }catch(err){
    console.log(err);
  }
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
    const res = await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return res
  }catch(err){
    console.log(err)
    return{
      ok: false
    }
  }
}
// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    const res = await fetch(`${API_URL}/launches/${id}`,{
      method: "delete"
    })
    return res
  }catch(err){
    console.log(err)
    return{
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};