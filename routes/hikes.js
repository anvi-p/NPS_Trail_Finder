const express = require('express');
const router = express.Router();
const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

router.get("/", (request, response) => {
    response.render("searchHikes");
});

router.post("/getHikes", (request, response) => {
    const {state, difficulty} = request.body;
    const hikeCode = "BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA";
    const url = `https://developer.nps.gov/api/v1/thingstodo?q=${hikeCode}&&${difficulty}&stateCode=${state}&api_key=${process.env.API_KEY}&limit=10&sort=-relevanceScore`; 
    (async () => {
        const api_response = await fetch(url);
        const hikes = await api_response.json();
        const hikesList = hikes.data;
        let table = "<table border='1'><tr><th>Title</th><th>Description</th><th>Duration</th><th>Image</th></tr>";
        hikesList.forEach(entry => table += `<tr><td>${entry.title}</td><td>${entry.shortDescription}</td><td>${entry.duration}</td><td><img src=${entry.images[0].url}></td></tr>`);
        table += "</table>";
        response.render("retrieveHikes", {hikesList: table, state: state});
    })();
});

router.use((request, response) => {
    response.status(404).send("Resource Not Found (in hikes router)");
});

module.exports = router;