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
    const url = `https://developer.nps.gov/api/v1/thingstodo?stateCode=${state}&q=${hikeCode} AND ${difficulty}&api_key=${process.env.API_KEY}&limit=20&sort=-relevanceScore`; 
    console.log(url);
    (async () => {
        const api_response = await fetch(url);
        const hikes = await api_response.json();
        const hikesList = hikes.data;
        let cardsList = "";
        hikesList.forEach(entry => {
            let durationString = "";
            if(entry.duration.length > 0){
                durationString = `(${entry.duration})`;
            }
            cardsList += `<article class="card">
                            <h3>${entry.title} ${durationString}</h3>
                            <img src=${entry.images[0].url}>
                            <div class="description"><p>${entry.shortDescription}</p><div>
                            <footer><a href=${entry.url}>Learn more here!</a></footer>
                        </article>`;
                    });

        response.render("retrieveHikes", {hikesCards: cardsList, state: state});
    })();
});

router.use((request, response) => {
    response.status(404).send("Resource Not Found (in hikes router)");
});

module.exports = router;