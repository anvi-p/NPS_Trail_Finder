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

        let table = "<table border='1'><tr><th>Trail</th><th>Name</th><th>Comment</th></tr>";

        let cursor = collection.find({});
        let document = await cursor.next();
        while (document != null) {
            table += `<tr><td>${document.Trail}</td><td>${document.Name}</td><td>${document.Comment}</td></tr>`;
            document = await cursor.next();
        }

        table += "</table>"
        return table;

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = router;