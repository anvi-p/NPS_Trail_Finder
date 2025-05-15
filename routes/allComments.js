const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");

router.get("/", async (request, response) => {
    let table = await retrieve();
    let data = {
        table: table
    }
    response.render("retrieveComments", data);
});

async function retrieve() {
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(process.env.MONGO_COLLECTION);

        let cardsList = "";
        let cursor = collection.find({});
        let document = await cursor.next();
        while (document != null) {
            cardsList += `<article class="card">
                            <h4>${document.Trail}</h4>
                            <p class="commentsCard">${document.Comment}</p>
                            <h3>${document.Email} - ${document.Name}</h3>
                        </article>`;
            document = await cursor.next();
        }
        return cardsList;

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = router;