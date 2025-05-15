const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
    response.render("addComment");
});

router.post("/getComments", async (request, response) => {
    const trailName = request.body.name;
    const author = request.body.author;
    const comment = request.body.comment;

    await saveInMongo(trailName, author, comment);
    
    let data = {
        trailName: trailName,
        name: author,
        comment: comment
    };

    response.render("commentConfirm.ejs", data);
});

/*** MONGODB CODE ***/
async function saveInMongo(name, author, comment) {
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(process.env.MONGO_COLLECTION);

        const data = {
            Trail: name,
            Name: author,
            Comment: comment
        };
        await collection.insertOne(data);

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}