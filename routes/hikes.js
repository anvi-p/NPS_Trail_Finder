const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
    response.render("searchHikes");
});

router.post("/getHikes", (request, response) => {
    const state = document.querySelector("#state").value;
    const difficulty = document.querySelector("#difficulty").value;
    const freeHikes = document.querySelector("#freeHikes").checked;
    const petFriendly = document.querySelector("#petFriendly").checked;

    (async () => {
        const response = await fetch(url);
        const text = await response.json();
        response.render("retrieveHikes");
    })();
});

router.use((request, response) => {
    response.status(404).send("Resource Not Found (in hikes router)");
});

module.exports = router;