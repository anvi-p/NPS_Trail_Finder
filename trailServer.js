const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

const app = express();
const portNumber = 5000;
process.stdin.setEncoding("utf8");

const hikes = require("./routes/hikes");
const parks = require("./routes/parks");

/********* COMMAND LINE CODE *********/
const server = app.listen(portNumber, () => {
    console.log(`Web server is running at http://localhost:${portNumber}`);
    process.stdout.write("Stop to shutdown the server: ");
});

process.stdin.on('readable', () => {
	const dataInput = process.stdin.read();
	if (dataInput !== null) {
		const command = dataInput.trim();
		if (command === "stop") {
			process.stdout.write("Shutting down the server"); 
            process.exit(0); 
        }
    }
});


/******* EXPRESS ROUTING CODE ********/
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use("/search", hikes);
app.use("/parks", parks);

app.use('/', (request, response) => {
    response.render("index");
});