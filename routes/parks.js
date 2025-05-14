const express = require('express');
const router = express.Router();
const hiking_url = `https://developer.nps.gov/api/v1/activities/parks?id=&q=%22Hiking%22&limit=10&sort=&api_key=${process.env.API_KEY}`;
const astro_url = `https://developer.nps.gov/api/v1/activities/parks?id=&q=%22Astronomy%22&limit=10&sort=&api_key=${process.env.API_KEY}`;
const ac_url = `https://developer.nps.gov/api/v1/activities/parks?id=&q=%22Arts%20and%20Culture%22&limit=10&sort=&api_key=${process.env.API_KEY}`;
const wild_url = `https://developer.nps.gov/api/v1/activities/parks?id=&q=%22Wildlife%20Watching%22&limit=10&sort=&api_key=${process.env.API_KEY}`;

// This is actually /parks
router.get("/", (request, response) => {
    response.render("searchParks");
});

router.post("/getActivity", async (request, response) => {
    let activity = request.body.activity;
    let table = "<table border='1'><tr><th>Designation</th><th>Name</th><th>Website</th></tr>";
    let url = "";

    if (activity === "Arts and Culture") {
        url = ac_url;
    } else if (activity === "Hiking") {
        url = hiking_url;
    } else if (activity === "Wildlife") {
        url = wild_url;
    } else {
        url = astro_url;
    }

    let res = await fetch(url);
    let jsonData = await res.json();
    let data = jsonData.data;
    let parks = data[0].parks;

    let i = 0;
    for (const park of parks) {
        if (i === 10) {
            break;
        }
        i += 1;

        let name = park.fullName;
        let desig = park.designation;
        let link = park.url;

        table += `<tr><td>${desig}</td><td>${name}</td><td><a href=${link}>Website</a></td></tr>`;
    }
    
    table += "</table>"

    let vals = {
        activity: activity,
        table: table
    }

    response.render("retrieveParks", vals);
});

router.use((request, response) => {
    response.status(404).send("Resource Not Found");
});

module.exports = router;