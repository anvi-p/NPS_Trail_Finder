const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

router.get("/", (request, response) => {
    response.render("addComment");
});

router.post("/", async (request, response) => {
    const trailName = request.body.name;
    const author = request.body.author;
    const email = request.body.email;
    const comment = request.body.comment;

    await saveInMongo(trailName, author, email, comment);
    
    let data = {
        trailName: trailName,
        name: author,
        email: email,
        comment: comment
    };

    response.render("commentConfirm.ejs", data);
});

/*** MONGODB CODE ***/
async function saveInMongo(name, author, email, comment) {
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(process.env.MONGO_COLLECTION);

        const data = {
            Trail: name,
            Name: author,
            Email: email,
            Comment: comment
        };
        await collection.insertOne(data);

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = router;